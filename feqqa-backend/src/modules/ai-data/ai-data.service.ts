import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Between } from 'typeorm';

import { Sale } from '../sales/entities/sale.entity';

import { ProductsService } from '../products/products.service';

import { CustomersService } from '../customers/customers.service';

import { ExpensesService } from '../expenses/expenses.service';

import { GetSalesQueryDto } from './dtos/get-sales-query.dto';

import { GetExpensesQueryDto } from './dtos/get-expenses-query.dto';


function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


@Injectable()
export class AiDataService {

    constructor(
        @InjectRepository(Sale)
        private readonly saleRepo: Repository<Sale>,

        private readonly productsService: ProductsService,

        private readonly customersService: CustomersService,

        private readonly expensesService: ExpensesService,
    ) {}


    async getSalesData(
        businessId: string,
        query: GetSalesQueryDto,
    ) {

        const todayStr = formatLocalDate(new Date());

        const startDate = query.start_date
            ? new Date(`${query.start_date}T00:00:00`)
            : new Date(`${todayStr}T00:00:00`);

        const endDate = query.end_date
            ? new Date(`${query.end_date}T23:59:59.999`)
            : new Date(`${todayStr}T23:59:59.999`);


        const sales = await this.saleRepo.find({
            where: {
                business: {
                    id: businessId,
                },

                created_at: Between(
                    startDate,
                    endDate,
                ),
            },

            relations: {
                items: {
                    product: true,
                },
            },
        });


        const totalSales = sales.reduce(
            (sum, sale) =>
                sum + Number(sale.total_amount || 0),
            0,
        );


        /**
         * Aggregate sold products.
         */
        const productMap = new Map<
            string,
            {
                product_name: string;
                quantity_sold: number;
                sales_amount: number;
            }
        >();


        for (const sale of sales) {

            for (const item of sale.items ?? []) {

                const productId =
                    item.product?.id ??
                    'unknown';

                const productName =
                    item.product?.name ??
                    'منتج غير معروف';


                const existing =
                    productMap.get(productId);


                if (existing) {

                    existing.quantity_sold +=
                        Number(item.quantity || 0);

                    existing.sales_amount +=
                        Number(item.total_price || 0);

                } else {

                    productMap.set(productId, {

                        product_name:
                            productName,

                        quantity_sold:
                            Number(
                                item.quantity || 0,
                            ),

                        sales_amount:
                            Number(
                                item.total_price || 0,
                            ),
                    });
                }
            }
        }


        const products = Array.from(
            productMap.values(),
        ).sort(
            (a, b) =>
                b.quantity_sold -
                a.quantity_sold,
        );


        return {

            start_date:
                formatLocalDate(startDate),

            end_date:
                formatLocalDate(endDate),

            total_sales:
                totalSales,

            transactions_count:
                sales.length,

            currency:
                'EGP',

            products,
        };
    }


    async getLowStock(
        businessId: string,
    ) {

        const lowStockProducts =
            await this.productsService.getLowStockProducts(
                businessId,
            );


        return {

            products:
                lowStockProducts.map(
                    (product) => ({

                        product_id:
                            product.id,

                        product_name:
                            product.name,

                        current_stock:
                            product.current_stock,

                        minimum_stock:
                            product.minimum_stock,
                    }),
                ),
        };
    }


    async getReceivables(
        businessId: string,
    ) {

        return this.customersService.getReceivables(
            businessId,
        );
    }


    async getExpenses(
        businessId: string,
        query: GetExpensesQueryDto,
    ) {

        const now = new Date();

        const month =
            query.month ??
            `${now.getFullYear()}-${String(
                now.getMonth() + 1,
            ).padStart(2, '0')}`;


        return this.expensesService.getMonthlySummary(
            businessId,
            month,
        );
    }


    async getCashFlowHistorical(
        businessId: string,
        days: number = 30,
    ) {

        const endDate = new Date();

        const startDate = new Date();

        startDate.setDate(
            startDate.getDate() - days,
        );


        const [
            sales,
            expenses,
            receivables,
        ] = await Promise.all([

            this.saleRepo.find({

                where: {

                    business: {
                        id: businessId,
                    },

                    created_at: Between(
                        startDate,
                        endDate,
                    ),
                },
            }),


            this.expensesService.getExpenses(
                businessId,
            ),


            this.customersService.getReceivables(
                businessId,
            ),
        ]);


        const totalSales =
            sales.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.total_amount || 0,
                    ),
                0,
            );


        const recentExpenses =
            expenses.filter(
                (expense) =>
                    new Date(
                        expense.expense_date,
                    ) >= startDate,
            );


        const totalExpenses =
            recentExpenses.reduce(
                (sum, expense) =>
                    sum +
                    Number(
                        expense.amount || 0,
                    ),
                0,
            );


        const totalReceivables =
            receivables.customers.reduce(
                (sum, customer) =>
                    sum +
                    Number(
                        customer.amount || 0,
                    ),
                0,
            );


        const weeklyExpenseEstimate =
            days > 0
                ? totalExpenses /
                  (days / 7)
                : 0;


        return {

            period_days:
                days,

            start_date:
                formatLocalDate(startDate),

            end_date:
                formatLocalDate(endDate),

            current_cash_balance:
                totalSales -
                totalExpenses,

            total_sales:
                totalSales,

            total_expenses:
                totalExpenses,

            expected_receivables_7d:
                totalReceivables,

            expected_expenses_7d:
                weeklyExpenseEstimate,

            currency:
                'EGP',
        };
    }
}
