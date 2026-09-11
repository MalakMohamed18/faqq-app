import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@ApiTags('Customers & Receivables')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    /**
     * Register a new customer
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new customer' })
    @ApiResponse({ status: 201, description: 'Customer created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input payload.' })
    async createCustomer(@CurrentUser() business: JWTPayloadType, @Body() dto: CreateCustomerDto) {
        return this.customersService.createCustomer(business.sub, dto);
    }

    /**
     * Get all customers for the business
     */
    @Get()
    @ApiOperation({ summary: 'Get all customers' })
    @ApiResponse({ status: 200, description: 'Customers list retrieved successfully.' })
    async getCustomers(@CurrentUser() business: JWTPayloadType) {
        return this.customersService.getCustomers(business.sub);
    }

    /**
     * Get customer debts/receivables (Used by AI and app receivables screen)
     */
    @Get('receivables')
    @ApiOperation({ summary: 'Get customers with outstanding debts (Receivables)' })
    @ApiResponse({ status: 200, description: 'Receivables retrieved successfully.' })
    async getReceivables(@CurrentUser() business: JWTPayloadType) {
        return this.customersService.getReceivables(business.sub);
    }

    /**
     * Get single customer details with sales statement
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get customer details and sales statement by ID' })
    @ApiResponse({ status: 200, description: 'Customer details retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Customer not found.' })
    async getCustomerById(@Param('id', ParseUUIDPipe) id: string) {
        return this.customersService.getCustomerById(id);
    }
}