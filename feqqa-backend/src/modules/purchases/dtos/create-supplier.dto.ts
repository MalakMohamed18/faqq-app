import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
    @ApiProperty({ example: 'المصرية للمنتجات الغذائية', description: 'اسم المورد أو الشركة' })
    @IsString()
    @IsNotEmpty({ message: 'اسم المورد مطلوب' })
    name: string;

    @ApiPropertyOptional({ example: '+201012345678', description: 'رقم هاتف المورد' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'شارع التسعين، التجمع الخامس', description: 'عنوان المورد' })
    @IsOptional()
    @IsString()
    address?: string;
}