import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'شاي العروسة 250جم', description: 'Product name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'https://example.com/images/tea.jpg', description: 'Product image URL' })
    @IsOptional()
    @IsString()
    image_url?: string;

    @ApiPropertyOptional({ example: 'مواد غذائية', description: 'Product category' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ example: 'TEA-001', description: 'Stock keeping unit or barcode' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiProperty({ example: 45.00, description: 'Selling price to the customer' })
    @IsNumber()
    @Min(0)
    selling_price: number;

    @ApiPropertyOptional({ example: 35.00, description: 'Purchase price from supplier' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    purchase_price?: number;

    @ApiProperty({ example: 50, description: 'Current available stock quantity' })
    @IsNumber()
    @Min(0)
    current_stock: number;

    @ApiPropertyOptional({ example: 10, description: 'Minimum stock limit before alert triggers' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minimum_stock?: number;

    @ApiPropertyOptional({ example: '2028-12-01', description: 'Product expiry date (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    expiry_date?: string;
}