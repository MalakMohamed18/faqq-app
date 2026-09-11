import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { StockMovement } from './entities/StockMovement.entity';
import { MovementType } from 'src/utils/enums';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(StockMovement)
        private readonly stockMovementRepo: Repository<StockMovement>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * Create a new product for a specific business
     */
    async createProduct(businessId: string, dto: CreateProductDto) {
        const product = this.productRepo.create({
            ...dto,
            business: { id: businessId },
        });

        const savedProduct = await this.productRepo.save(product);

        // If initial stock is greater than 0, log an initial inventory movement
        if (dto.current_stock > 0) {
            const movement = this.stockMovementRepo.create({
                type: MovementType.ADJUSTMENT,
                quantity_change: dto.current_stock,
                resulting_stock: dto.current_stock,
                product: { id: savedProduct.id },
            });
            await this.stockMovementRepo.save(movement);
        }

        return savedProduct;
    }

    /**
     * Get all products for a business with optional category filter
     */
    async getProducts(businessId: string, filters?: { category?: string }) {
        const query = this.productRepo.createQueryBuilder('product')
            .where('product.business_id = :businessId', { businessId });

        if (filters?.category) {
            query.andWhere('product.category = :category', { category: filters.category });
        }

        return query.getMany();
    }

    /**
     * Get low stock products (current stock <= minimum stock)
     */
    async getLowStockProducts(businessId: string) {
        return this.productRepo
            .createQueryBuilder('product')
            .where('product.business_id = :businessId', { businessId })
            .andWhere('product.current_stock <= product.minimum_stock')
            .getMany();
    }

    /**
     * Get product details along with its stock movement history
     */
    async getProductById(id: string) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: {
                movements: true
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found.`);
        }

        return product;
    }

    /**
     * Update general product details
     */
    async updateProduct(id: string, dto: UpdateProductDto) {
        const product = await this.getProductById(id);

        Object.assign(product, dto);
        return this.productRepo.save(product);
    }

    /**
     * Quick update for stock quantity (Adjustment from inventory screen) using a transaction
     */
    async updateStock(id: string, newStock: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const product = await queryRunner.manager.findOne(Product, { where: { id } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found.`);
            }

            const quantityChange = newStock - product.current_stock;
            product.current_stock = newStock;
            await queryRunner.manager.save(Product, product);

            const movement = queryRunner.manager.create(StockMovement, {
                type: MovementType.ADJUSTMENT,
                quantity_change: quantityChange,
                resulting_stock: newStock,
                product: { id: product.id },
            });
            await queryRunner.manager.save(StockMovement, movement);

            await queryRunner.commitTransaction();
            return product;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}