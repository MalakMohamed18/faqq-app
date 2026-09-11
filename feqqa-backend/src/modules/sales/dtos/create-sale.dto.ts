import { IsNotEmpty, IsEnum, IsNumber, IsUUID, IsOptional, ValidateNested, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../entities/sale.entity';

class SaleItemDto {
    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'Product UUID' })
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @ApiProperty({ example: 2, description: 'Quantity purchased' })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 45.00, description: 'Unit price at the time of sale' })
    @IsNumber()
    @Min(0)
    unit_price: number;
}

export class CreateSaleDto {
    @ApiProperty({ type: [SaleItemDto], description: 'List of purchased items' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];

    @ApiProperty({ example: 90.00, description: 'Amount paid by the customer' })
    @IsNumber()
    @Min(0)
    paid_amount: number;

    @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.FULL, description: 'Payment status (FULL, PARTIAL, UNPAID)' })
    @IsEnum(PaymentStatus)
    payment_status: PaymentStatus;

    @ApiPropertyOptional({ example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', description: 'Customer UUID (Required for partial or unpaid sales)' })
    @IsUUID()
    @IsOptional()
    customer_id?: string;
}