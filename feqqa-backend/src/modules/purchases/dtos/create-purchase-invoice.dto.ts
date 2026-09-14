import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from 'src/utils/enums';

export class CreatePurchaseInvoiceItemDto {
    @ApiProperty({ example: 'حليب المراعي 1.5 لتر' })
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 65.5 })
    @IsNumber()
    @IsNotEmpty()
    unit_price: number;
}

export class CreatePurchaseInvoiceDto {
    @ApiProperty({ example: 'uuid-of-supplier', description: 'ID المورد' })
    @IsUUID()
    @IsNotEmpty()
    supplier_id: string;

    @ApiProperty({ example: 'INV-4029', description: 'رقم الفاتورة' })
    @IsString()
    @IsNotEmpty()
    invoice_number: string;

    @ApiProperty({ example: '2026-05-26', description: 'تاريخ الفاتورة' })
    @IsDateString()
    @IsNotEmpty()
    invoice_date: string;

    @ApiPropertyOptional({ enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
    @IsOptional()
    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;

    @ApiProperty({ type: [CreatePurchaseInvoiceItemDto], description: 'عناصر الفاتورة' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseInvoiceItemDto)
    items: CreatePurchaseInvoiceItemDto[];

    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...', description: 'رابط صورة الفاتورة المرفوعة' })
    @IsOptional()
    @IsString()
    receipt_url?: string;
}