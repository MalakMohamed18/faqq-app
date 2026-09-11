import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dtos/create-sale.dto';
import type { JWTPayloadType } from 'src/utils/types';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Sales')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/sales')
export class SalesController {
    constructor(
        private readonly salesService: SalesService
    ) { }

    /**
     * Create a new sale transaction, deduct inventory, and update customer debt if applicable.
     * @param business - Request object containing authenticated user/business payload
     * @param dto - Sale details payload containing items, payment status, and customer ID
     * @returns The created sale record
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new sale transaction' })
    @ApiResponse({ status: 201, description: 'Sale created successfully, inventory updated, and debt recorded.' })
    @ApiResponse({ status: 400, description: 'Bad request (e.g. missing customer for unpaid/partial sales).' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async createSale(@CurrentUser() business: JWTPayloadType, @Body() dto: CreateSaleDto) {
        return this.salesService.createSale(business.sub, dto);
    }
}