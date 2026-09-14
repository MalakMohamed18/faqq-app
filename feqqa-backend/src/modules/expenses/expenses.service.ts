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

    async createExpense(
        businessId: string,
        dto: CreateExpenseDto,
    ) {
        const expense = this.expenseRepo.create({
            ...dto,
            expense_date: new Date(dto.expense_date),
            business: { id: businessId },
        });

        return this.expenseRepo.save(expense);
    }

    async getExpenses(businessId: string) {
        return this.expenseRepo.find({
            where: {
                business: { id: businessId },
            },
            order: {
                expense_date: 'DESC',
            },
        });
    }

    async getMonthlySummary(
        businessId: string,
        month: string,
    ) {
        const startDate = new Date(`${month}-01`);

        const endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
        );

        const expenses = await this.expenseRepo.find({
            where: {
                business: { id: businessId },
                expense_date: Between(
                    startDate,
                    endDate,
                ),
            },
        });

        const totalExpenses = expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0,
        );

        const categoryMap = new Map<string, number>();

        expenses.forEach((expense) => {
            const current =
                categoryMap.get(expense.category) ?? 0;

            categoryMap.set(
                expense.category,
                current + Number(expense.amount),
            );
        });

        /*
         * Previous month
         */
        const previousMonthStart = new Date(
            startDate.getFullYear(),
            startDate.getMonth() - 1,
            1,
        );

        const previousMonthEnd = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            0,
            23,
            59,
            59,
            999,
        );

        const previousExpenses =
            await this.expenseRepo.find({
                where: {
                    business: { id: businessId },
                    expense_date: Between(
                        previousMonthStart,
                        previousMonthEnd,
                    ),
                },
            });

        const previousPeriodExpenses =
            previousExpenses.reduce(
                (sum, expense) =>
                    sum + Number(expense.amount),
                0,
            );

        return {
            month,

            total_expenses: totalExpenses,

            previous_period_expenses:
                previousPeriodExpenses,

            currency: 'EGP',

            categories:
                Array.from(categoryMap.entries()).map(
                    ([category, amount]) => ({
                        category,
                        amount,
                    }),
                ),
        };
    }
}