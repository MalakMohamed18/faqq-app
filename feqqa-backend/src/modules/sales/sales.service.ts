import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale, PaymentStatus } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { StockMovement } from '../products/entities/StockMovement.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { MovementType } from 'src/utils/enums';

@Injectable()
export class SalesService {
    constructor(
        private readonly dataSource: DataSource
    ) { }

    /**
     * Create a new sale transaction, deduct inventory, and update customer debt if applicable.
     * @param req - Request object containing authenticated user/business payload
     * @param dto - Sale details payload containing items, payment status, and customer ID
     * @returns The created sale record
    */
    public async createSale(businessId: string, dto: CreateSaleDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        // 1. Start the database transaction
        await queryRunner.startTransaction();

        try {
            let totalAmount = 0;

            // 2. Validate products and calculate the total amount
            for (const item of dto.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: item.product_id, business: { id: businessId } },
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.product_id} not found.`);
                }
                totalAmount += item.quantity * item.unit_price;
            }

            // 3. Calculate the remaining amount and prepare the main Sale record
            const remainingAmount = totalAmount - dto.paid_amount;

            // Validate customer requirement for partial or unpaid sales
            if (dto.payment_status !== PaymentStatus.FULL && !dto.customer_id) {
                throw new BadRequestException('Customer ID is required for partial or unpaid sales.');
            }

            const sale = queryRunner.manager.create(Sale, {
                total_amount: totalAmount,
                paid_amount: dto.paid_amount,
                remaining_amount: remainingAmount,
                payment_status: dto.payment_status,
                business: { id: businessId },
                customer: dto.customer_id ? { id: dto.customer_id } : null,
            });

            const savedSale = await queryRunner.manager.save(Sale, sale);

            // 4. Create Sale Items, update inventory, and log stock movements
            for (const item of dto.items) {
                const product = await queryRunner.manager.findOne(Product, { where: { id: item.product_id } });

                // Save the individual sale item
                const saleItem = queryRunner.manager.create(SaleItem, {
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.quantity * item.unit_price,
                    sale: savedSale,
                    product: { id: product.id },
                });
                await queryRunner.manager.save(SaleItem, saleItem);

                // Deduct the sold quantity from the product's current stock
                const newStock = product.current_stock - item.quantity;
                product.current_stock = newStock;
                await queryRunner.manager.save(Product, product);

                // Record the stock movement for tracking and history
                const stockMovement = queryRunner.manager.create(StockMovement, {
                    type: MovementType.SALE,
                    quantity_change: -item.quantity,
                    resulting_stock: newStock,
                    reference_id: savedSale.id,
                    product: { id: product.id },
                });
                await queryRunner.manager.save(StockMovement, stockMovement);
            }

            // 5. Update the customer's total debt if there is a remaining balance
            if (remainingAmount > 0 && dto.customer_id) {
                const customer = await queryRunner.manager.findOne(Customer, { where: { id: dto.customer_id } });
                if (customer) {
                    customer.total_debt = Number(customer.total_debt) + remainingAmount;
                    await queryRunner.manager.save(Customer, customer);
                }
            }

            // 6. Commit the transaction to apply all database changes permanently
            await queryRunner.commitTransaction();
            return savedSale;

        } catch (error) {
            // Rollback all changes if any error occurs during the process to maintain data consistency
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Failed to process the sale: ${error}`);
        } finally {
            // Release the QueryRunner connection back to the pool
            await queryRunner.release();
        }
    }
}