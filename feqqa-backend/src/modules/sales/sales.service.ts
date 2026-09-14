import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

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
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Create a new sale transaction,
   * deduct inventory, and update customer debt.
   */
  public async createSale(
    businessId: string,
    dto: CreateSaleDto,
  ) {
    const queryRunner =
      this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;

      // 1. Validate products and calculate total
      for (const item of dto.items) {
        const product =
          await queryRunner.manager.findOne(Product, {
            where: {
              id: item.product_id,
              business: { id: businessId },
            },
          });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product_id} not found.`,
          );
        }

        totalAmount +=
          item.quantity * item.unit_price;
      }

      // 2. Calculate remaining amount
      const remainingAmount =
        totalAmount - dto.paid_amount;

      // 3. Validate customer
      if (
        dto.payment_status !== PaymentStatus.FULL &&
        !dto.customer_id
      ) {
        throw new BadRequestException(
          'Customer ID is required for partial or unpaid sales.',
        );
      }

      // 4. Create sale
      const sale = queryRunner.manager.create(Sale, {
        total_amount: totalAmount,
        paid_amount: dto.paid_amount,
        remaining_amount: remainingAmount,
        payment_status: dto.payment_status,
        business: { id: businessId },
        customer: dto.customer_id
          ? { id: dto.customer_id }
          : null,
      });

      const savedSale =
        await queryRunner.manager.save(
          Sale,
          sale,
        );

      // 5. Create sale items + update stock
      for (const item of dto.items) {
        const product =
          await queryRunner.manager.findOne(Product, {
            where: {
              id: item.product_id,
            },
          });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product_id} not found.`,
          );
        }

        const saleItem =
          queryRunner.manager.create(SaleItem, {
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price:
              item.quantity * item.unit_price,
            sale: savedSale,
            product: { id: product.id },
          });

        await queryRunner.manager.save(
          SaleItem,
          saleItem,
        );

        const newStock =
          product.current_stock -
          item.quantity;

        product.current_stock = newStock;

        await queryRunner.manager.save(
          Product,
          product,
        );

        const stockMovement =
          queryRunner.manager.create(
            StockMovement,
            {
              type: MovementType.SALE,
              quantity_change: -item.quantity,
              resulting_stock: newStock,
              reference_id: savedSale.id,
              product: { id: product.id },
            },
          );

        await queryRunner.manager.save(
          StockMovement,
          stockMovement,
        );
      }

      // 6. Update customer debt
      if (
        remainingAmount > 0 &&
        dto.customer_id
      ) {
        const customer =
          await queryRunner.manager.findOne(
            Customer,
            {
              where: {
                id: dto.customer_id,
              },
            },
          );

        if (customer) {
          customer.total_debt =
            Number(customer.total_debt) +
            remainingAmount;

          await queryRunner.manager.save(
            Customer,
            customer,
          );
        }
      }

      await queryRunner.commitTransaction();

      return savedSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        `Failed to process the sale: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get today's sales for the authenticated business.
   */
  public async getTodaySales(
    businessId: string,
  ) {
    const sales =
      await this.dataSource
        .getRepository(Sale)
        .find({
          where: {
            business: {
              id: businessId,
            },
          },
        });

    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    const todaySales = sales.filter(
      (sale) => {
        const saleDateValue =
          (sale as any).created_at ??
          (sale as any).createdAt ??
          (sale as any).date;

        if (!saleDateValue) {
          return false;
        }

        const saleDate =
          new Date(saleDateValue);

        return (
          saleDate >= startOfToday &&
          saleDate <= endOfToday
        );
      },
    );

    const totalSales =
      todaySales.reduce(
        (sum, sale) =>
          sum +
          Number(sale.total_amount || 0),
        0,
      );

    return {
      date: today
        .toISOString()
        .slice(0, 10),

      total_sales: totalSales,

      transactions_count:
        todaySales.length,

      currency: 'EGP',
    };
  }

  /**
   * Get Sales Dashboard Analytics (Top Products, Categories, Total Revenue)
   */
  public async getSalesDashboard(businessId: string) {
    const totalSalesResult = await this.dataSource.getRepository(Sale)
      .createQueryBuilder('sale')
      .where('sale.business_id = :businessId', { businessId })
      .select('SUM(sale.total_amount)', 'total')
      .getRawOne();

    const totalSalesAmount = Number(totalSalesResult.total) || 0;

    const topProducts = await this.dataSource.getRepository(SaleItem)
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoin('item.sale', 'sale')
      .where('sale.business_id = :businessId', { businessId })
      .select([
        'product.id AS product_id',
        'product.name AS product_name',
        'product.image_url AS image_url',
        'SUM(item.quantity) AS total_quantity_sold',
        'SUM(item.total_price) AS total_revenue'
      ])
      .groupBy('product.id')
      .orderBy('total_quantity_sold', 'DESC')
      .limit(3)
      .getRawMany();

    const categorySales = await this.dataSource.getRepository(SaleItem)
      .createQueryBuilder('item')
      .leftJoin('item.product', 'product')
      .leftJoin('item.sale', 'sale')
      .where('sale.business_id = :businessId', { businessId })
      .andWhere('product.category IS NOT NULL')
      .select([
        'product.category AS category_name',
        'SUM(item.total_price) AS category_revenue'
      ])
      .groupBy('product.category')
      .orderBy('category_revenue', 'DESC')
      .getRawMany();

    const totalInvoices = await this.dataSource.getRepository(Sale).count({
      where: { business: { id: businessId } }
    });

    const averageInvoice = totalInvoices > 0 ? (totalSalesAmount / totalInvoices).toFixed(2) : 0;

    return {
      total_sales: totalSalesAmount,
      total_orders: totalInvoices,
      average_order_value: Number(averageInvoice),
      top_products: topProducts.map(tp => ({
        id: tp.product_id,
        name: tp.product_name,
        image: tp.image_url,
        quantity_sold: Number(tp.total_quantity_sold),
        revenue: Number(tp.total_revenue)
      })),
      sales_by_category: categorySales.map(cs => ({
        category: cs.category_name,
        revenue: Number(cs.category_revenue)
      }))
    };
  }
}