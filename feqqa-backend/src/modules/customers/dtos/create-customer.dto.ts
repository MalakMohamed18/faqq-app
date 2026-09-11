import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ example: 'محمود علي', description: 'Customer full name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: '+201012345678', description: 'Customer phone number' })
    @IsOptional()
    @IsString()
    phone?: string;
}