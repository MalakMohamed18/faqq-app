import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepo: Repository<Expense>,
    ) { }

    async createExpense(businessId: string, dto: CreateExpenseDto) {
        const expense = this.expenseRepo.create({
            ...dto,
            expense_date: new Date(dto.expense_date),
            business: { id: businessId },
        });
        return this.expenseRepo.save(expense);
    }

    async getExpenses(businessId: string) {
        return this.expenseRepo.find({
            where: { business: { id: businessId } },
            order: { expense_date: 'DESC' },
        });
    }

    async getMonthlySummary(businessId: string, month: string) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await this.expenseRepo.find({
            where: {
                business: { id: businessId },
                expense_date: Between(startDate, endDate),
            },
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

        const categoryMap = new Map<string, number>();
        expenses.forEach((exp) => {
            const current = categoryMap.get(exp.category) || 0;
            categoryMap.set(exp.category, current + Number(exp.amount));
        });

        return {
            month: month,
            total_expenses: totalExpenses,
            currency: 'EGP',
            categories: Array.from(categoryMap.entries()).map(([category, amount]) => ({
                category,
                amount,
            })),
        };
    }
}