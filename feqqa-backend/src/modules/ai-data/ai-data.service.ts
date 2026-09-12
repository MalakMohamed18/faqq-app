import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { ExpensesService } from '../expenses/expenses.service';
import { GetSalesQueryDto } from './dtos/get-sales-query.dto';
import { GetExpensesQueryDto } from './dtos/get-expenses-query.dto';

@Injectable()
export class AiDataService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepo: Repository<Sale>,
        private readonly productsService: ProductsService,
        private readonly customersService: CustomersService,
        private readonly expensesService: ExpensesService,
    ) { }

    async getSalesData(businessId: string, query: GetSalesQueryDto) {
        const todayStr = new Date().toISOString().split('T')[0];
        const startDate = query.start_date ? new Date(query.start_date) : new Date(todayStr);
        const endDate = query.end_date ? new Date(query.end_date) : new Date(startDate);

        endDate.setHours(23, 59, 59, 999);

        const sales = await this.saleRepo.find({
            where: {
                business: { id: businessId },
                created_at: Between(startDate, endDate),
            },
        });

        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);

        return {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            total_sales: totalSales,
            transactions_count: sales.length,
            currency: 'EGP',
        };
    }

    async getLowStock(businessId: string) {
        const lowStockProducts = await this.productsService.getLowStockProducts(businessId);
        return {
            products: lowStockProducts.map(p => ({
                product_name: p.name,
                current_stock: p.current_stock,
                minimum_stock: p.minimum_stock,
            })),
        };
    }

    async getReceivables(businessId: string) {
        return this.customersService.getReceivables(businessId);
    }

    // يخدم أدوات: getMonthlyExpenses و getTopExpense
    async getExpenses(businessId: string, query: GetExpensesQueryDto) {
        const month = query.month || new Date().toISOString().slice(0, 7);
        return this.expensesService.getMonthlySummary(businessId, month);
    }

    // يخدم أداة: getCashFlowForecast
    async getCashFlowHistorical(businessId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // سحب الإجماليات بشكل متوازي للسرعة
        const [sales, expenses, receivables] = await Promise.all([
            this.saleRepo.find({ where: { business: { id: businessId }, created_at: Between(startDate, new Date()) } }),
            this.expensesService.getExpenses(businessId),
            this.customersService.getReceivables(businessId)
        ]);

        const totalSales = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
        // فلترة المصروفات لآخر عدد أيام محدد
        const recentExpenses = expenses.filter(e => new Date(e.expense_date) >= startDate);
        const totalExpenses = recentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

        // إجمالي الديون الموجودة حالياً
        const totalReceivables = receivables.customers.reduce((sum, c) => sum + Number(c.amount), 0);

        return {
            current_cash_balance: totalSales - totalExpenses,
            expected_receivables_7d: totalReceivables, // افتراض إن الديون مستحقة قريباً
            expected_expenses_7d: totalExpenses / (days / 7), // متوسط أسبوعي مبني على التاريخ
            currency: 'EGP',
        };
    }
}