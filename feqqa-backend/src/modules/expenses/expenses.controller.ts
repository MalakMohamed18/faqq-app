import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/common/guards/auth.guard';

import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/expenses')
export class ExpensesController {
    constructor(
        private readonly expensesService: ExpensesService,
    ) { }

    // ============================================
    // CREATE EXPENSE
    // POST /api/expenses
    // ============================================

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new expense record',
    })
    @ApiResponse({
        status: 201,
        description: 'Expense created successfully.',
    })
    async createExpense(
        @CurrentUser() business: JWTPayloadType,
        @Body() dto: CreateExpenseDto,
    ) {
        return this.expensesService.createExpense(
            business.sub,
            dto,
        );
    }

    // ============================================
    // GET ALL EXPENSES
    // GET /api/expenses
    // ============================================

    @Get()
    @ApiOperation({
        summary: 'Get all expenses history',
    })
    async getExpenses(
        @CurrentUser() business: JWTPayloadType,
    ) {
        return this.expensesService.getExpenses(
            business.sub,
        );
    }

    // ============================================
    // MONTHLY SUMMARY
    // GET /api/expenses/monthly-summary?month=2026-09
    // ============================================

    @Get('monthly-summary')
    @ApiOperation({
        summary:
            'Get monthly expenses summary',
    })
    @ApiQuery({
        name: 'month',
        required: true,
        example: '2026-09',
    })
    async getMonthlySummary(
        @CurrentUser() business: JWTPayloadType,
        @Query('month') month: string,
    ) {
        return this.expensesService.getMonthlySummary(
            business.sub,
            month,
        );
    }

    // ============================================
    // AI SUMMARY
    // GET /api/expenses/summary?month=2026-09
    // ============================================

    @Get('summary')
    @ApiOperation({
        summary:
            'Get expenses summary for AI',
    })
    @ApiQuery({
        name: 'month',
        required: false,
        example: '2026-09',
    })
    async getSummary(
        @CurrentUser() business: JWTPayloadType,
        @Query('month') month?: string,
    ) {
        const currentMonth =
            month ??
            new Date().toISOString().slice(0, 7);

        return this.expensesService.getMonthlySummary(
            business.sub,
            currentMonth,
        );
    }
}