import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePurchaseReturnDto {
    @ApiProperty({ example: 'uuid-of-supplier', description: 'ID المورد' })
    @IsUUID()
    @IsNotEmpty()
    supplier_id: string;

    @ApiProperty({ example: 'حليب المراعي 1.5 لتر' })
    @IsString()
    @IsNotEmpty({ message: 'اسم المنتج مطلوب' })
    product_name: string;

    @ApiProperty({ example: 5, description: 'الكمية المسترجعة' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 325.5, description: 'المبلغ المسترد' })
    @IsNumber()
    @IsNotEmpty()
    refund_amount: number;

    @ApiPropertyOptional({ example: 'انتهاء الصلاحية', description: 'سبب الإرجاع' })
    @IsOptional()
    @IsString()
    return_reason?: string;
}