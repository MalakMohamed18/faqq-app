import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@ApiTags('Products & Inventory')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    /**
     * Create a new product for the authenticated business.
     * @param req - Request object containing authenticated user/business payload
     * @param dto - Product creation payload (name, price, stock, category, sku, etc.)
     * @returns The created product record
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input payload.' })
    async createProduct(@CurrentUser() business: JWTPayloadType, @Body() dto: CreateProductDto) {
        return this.productsService.createProduct(business.sub, dto);
    }

    /**
     * Retrieve all products for the authenticated business with optional filters.
     * @param req - Request object containing authenticated user/business payload
     * @param category - Optional category filter
     * @returns List of products
     */
    @Get()
    @ApiOperation({ summary: 'Get all products (with optional filters)' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
    @ApiQuery({ name: 'category', required: false, type: String })
    async getProducts(@CurrentUser() business: JWTPayloadType, @Query('category') category?: string) {
        return this.productsService.getProducts(business.sub, { category });
    }

    /**
     * Get products with low stock (current stock <= minimum stock) for alerts and AI copilot.
     * @param req - Request object containing authenticated user/business payload
     * @returns List of low stock products
     */
    @Get('low-stock')
    @ApiOperation({ summary: 'Get low stock products for alerts and AI' })
    @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully.' })
    async getLowStockProducts(@CurrentUser() business: JWTPayloadType) {
        return this.productsService.getLowStockProducts(business.sub);
    }

    /**
     * Get product details and stock movement history by ID.
     * @param id - Product UUID
     * @returns Product details with movements history
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get product details and stock history by ID' })
    @ApiResponse({ status: 200, description: 'Product details retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async getProductById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.getProductById(id);
    }

    /**
     * Update product details (e.g., price, name, category).
     * @param id - Product UUID
     * @param dto - Update payload
     * @returns Updated product record
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update product details' })
    @ApiResponse({ status: 200, description: 'Product updated successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.updateProduct(id, dto);
    }

    /**
     * Quick update for product stock (Adjustment from inventory screen).
     * @param id - Product UUID
     * @param body - New stock value
     * @returns Updated product record
     */
    @Patch(':id/stock')
    @ApiOperation({ summary: 'Quick update product stock quantity' })
    @ApiResponse({ status: 200, description: 'Stock updated successfully and movement logged.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    async updateStock(@Param('id', ParseUUIDPipe) id: string, @Body('new_stock') newStock: number) {
        return this.productsService.updateStock(id, newStock);
    }
}