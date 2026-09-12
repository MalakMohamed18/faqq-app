import { Controller, Get, Query, UseGuards, Req, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AiDataService } from './ai-data.service';
import { GetSalesQueryDto } from './dtos/get-sales-query.dto';
import { GetExpensesQueryDto } from './dtos/get-expenses-query.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@ApiTags('AI Data Integration')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/ai-data')
export class AiDataController {
    constructor(private readonly aiDataService: AiDataService) { }

    @Get('sales')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get verified sales metrics for AI Copilot' })
    @ApiResponse({ status: 200, description: 'Sales data retrieved successfully' })
    async getSales(@CurrentUser() business: JWTPayloadType, @Query() query: GetSalesQueryDto) {
        return this.aiDataService.getSalesData(business.sub, query);
    }

    @Get('inventory/low-stock')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get low stock products for AI Copilot' })
    @ApiResponse({ status: 200, description: 'Low stock items returned' })
    async getLowStock(@CurrentUser() business: JWTPayloadType) {
        return this.aiDataService.getLowStock(business.sub);
    }

    @Get('receivables')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get outstanding customer debts for AI Copilot' })
    @ApiResponse({ status: 200, description: 'Receivables list returned' })
    async getReceivables(@CurrentUser() business: JWTPayloadType) {
        return this.aiDataService.getReceivables(business.sub);
    }

    @Get('expenses')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get monthly expense breakdown for AI Copilot' })
    @ApiResponse({ status: 200, description: 'Expenses data returned' })
    async getExpenses(@CurrentUser() business: JWTPayloadType, @Query() query: GetExpensesQueryDto) {
        return this.aiDataService.getExpenses(business.sub, query);
    }

    @Get('cashflow/historical')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get cashflow data for AI forecasting' })
    @ApiResponse({ status: 200, description: 'Cashflow summary returned' })
    @ApiQuery({ name: 'days', required: false, type: Number, example: 30 })
    async getCashFlow(
        @CurrentUser() business,
        @Query('days', new ParseIntPipe({ optional: true })) days?: number,
    ) {
        return this.aiDataService.getCashFlowHistorical(business.sub, days || 30);
    }
}