import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
    private readonly salesService: SalesService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new sale transaction',
  })
  @ApiResponse({
    status: 201,
    description:
      'Sale created successfully, inventory updated, and debt recorded.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request (e.g. missing customer for unpaid/partial sales).',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async createSale(
    @CurrentUser() business: JWTPayloadType,
    @Body() dto: CreateSaleDto,
  ) {
    return this.salesService.createSale(
      business.sub,
      dto,
    );
  }

  @Get('today')
  @ApiOperation({
    summary: 'Get today sales',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns total sales for today.',
  })
  async getTodaySales(
    @CurrentUser() business: JWTPayloadType,
  ) {
    return this.salesService.getTodaySales(
      business.sub,
    );
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get sales analytics (Top products, categories, total revenue)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns data for the Sales Analytics screen.',
  })
  async getSalesDashboard(
    @CurrentUser() business: JWTPayloadType,
  ) {
    return this.salesService.getSalesDashboard(
      business.sub,
    );
  }
}