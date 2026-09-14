import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dtos/create-supplier.dto';

@ApiTags('Suppliers')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    // ============================================
    // CREATE SUPPLIER
    // POST /api/suppliers
    // ============================================
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add a new supplier' })
    @ApiResponse({ status: 201, description: 'Supplier created successfully.' })
    async create(
        @CurrentUser() business: JWTPayloadType,
        @Body() dto: CreateSupplierDto,
    ) {
        return this.suppliersService.createSupplier(business.sub, dto);
    }

    // ============================================
    // GET ALL SUPPLIERS
    // GET /api/suppliers
    // ============================================
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all business suppliers' })
    async findAll(
        @CurrentUser() business: JWTPayloadType,
    ) {
        const suppliers = await this.suppliersService.getSuppliers(business.sub);

        return {
            count: suppliers.length,
            suppliers,
        };
    }
}