import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto } from './dtos/create-purchase-invoice.dto';
import { InvoiceStatus } from 'src/utils/enums';

@ApiTags('Purchase Invoices')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/purchase-invoices')
export class PurchaseInvoicesController {
    constructor(private readonly invoiceService: PurchaseInvoicesService) { }

    // POST /api/purchase-invoices
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new purchase invoice with items' })
    async create(
        @CurrentUser() business: JWTPayloadType,
        @Body() dto: CreatePurchaseInvoiceDto,
    ) {
        return this.invoiceService.createInvoice(business.sub, dto);
    }

    // GET /api/purchase-invoices?status=PAID
    @Get()
    @ApiOperation({ summary: 'Get all purchase invoices' })
    @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false, description: 'PAID or UNPAID' })
    async findAll(
        @CurrentUser() business: JWTPayloadType,
        @Query('status') status?: InvoiceStatus,
    ) {
        const invoices = await this.invoiceService.getInvoices(business.sub, status);

        return {
            count: invoices.length,
            invoices
        };
    }

    // GET api/purchase-invoices/dashboard
    @Get('dashboard')
    @ApiOperation({ summary: 'Get purchases and suppliers dashboard statistics' })
    async getDashboard(@CurrentUser() business: JWTPayloadType) {
        return this.invoiceService.getPurchasesDashboard(business.sub);
    }
}