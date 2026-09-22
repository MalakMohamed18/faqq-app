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
    async createProduct(business_id: string, dto: CreateProductDto) {
        const product = this.productRepo.create({
            ...dto,
            business: { id: business_id },
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
    async getProducts(business_id: string, filters?: { category?: string }) {
        const query = this.productRepo.createQueryBuilder('product')
            .where('product.business_id = :business_id', { business_id });

        if (filters?.category) {
            query.andWhere('product.category = :category', { category: filters.category });
        }

        return query.getMany();
    }

    /**
     * Get low stock products (current stock <= minimum stock)
     */
    async getLowStockProducts(business_id: string) {
        return this.productRepo
            .createQueryBuilder('product')
            .where('product.business_id = :business_id', { business_id })
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

    async getInventoryDashboard(business_id: string) {

        const inventoryStats = await this.productRepo.createQueryBuilder('product')
            .where('product.business_id = :business_id', { business_id })
            .select([
                'COUNT(product.id) AS total_products',
                'SUM(product.current_stock * product.purchase_price) AS total_value'
            ])
            .getRawOne();

        const lowStockProducts = await this.productRepo.createQueryBuilder('product')
            .where('product.business_id = :business_id', { business_id })
            .andWhere('product.current_stock <= product.minimum_stock')
            .andWhere('product.current_stock > 0')
            .orderBy('product.current_stock', 'ASC')
            .limit(5)
            .getMany();

        const outOfStockProducts = await this.productRepo.count({
            where: {
                business: { id: business_id },
                current_stock: 0
            }
        });

        return {
            total_products: Number(inventoryStats.total_products) || 0,
            total_inventory_value: Number(inventoryStats.total_value) || 0,
            low_stock_count: lowStockProducts.length,
            out_of_stock_count: outOfStockProducts,
            low_stock_items: lowStockProducts
        };
    }

    /**
     * Get stock movement history for a specific product
     */
    async getProductMovements(businessId: string, productId: string) {
        const product = await this.productRepo.findOne({
            where: { id: productId, business: { id: businessId } }
        });

        if (!product) {
            throw new NotFoundException('المنتج غير موجود');
        }

        const movements = await this.dataSource.getRepository(StockMovement)
            .find({
                where: { product: { id: productId } },
                order: { created_at: 'DESC' },
            });

        return {
            product: {
                id: product.id,
                name: product.name,
                current_stock: product.current_stock,
            },
            movements: movements.map(movement => ({
                id: movement.id,
                type: movement.type,
                quantity_change: movement.quantity_change,
                resulting_stock: movement.resulting_stock,
                date: movement.created_at,
                reference_id: movement.reference_id
            }))
        };
    }
}