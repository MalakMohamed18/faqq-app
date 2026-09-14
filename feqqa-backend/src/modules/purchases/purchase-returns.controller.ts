import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { PurchaseReturnsService } from './purchase-returns.service';
import { CreatePurchaseReturnDto } from './dtos/create-purchase-return.dto';

@ApiTags('Purchase Returns')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/purchase-returns')
export class PurchaseReturnsController {
    constructor(private readonly returnsService: PurchaseReturnsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a product return' })
    async create(
        @CurrentUser() business: JWTPayloadType,
        @Body() dto: CreatePurchaseReturnDto,
    ) {
        return this.returnsService.createReturn(business.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all returns history' })
    async findAll(@CurrentUser() business: JWTPayloadType) {
        const returns = await this.returnsService.getReturns(business.sub);
        return { count: returns.length, returns };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a return record' })
    @ApiParam({ name: 'id', description: 'Return ID' })
    async remove(
        @CurrentUser() business: JWTPayloadType,
        @Param('id') id: string,
    ) {
        return this.returnsService.deleteReturn(business.sub, id);
    }
}