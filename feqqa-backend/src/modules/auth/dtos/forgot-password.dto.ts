import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthEmailDto {
    @ApiProperty({ example: 'owner@business.com' })
    @IsEmail({}, { message: 'يجب إدخال بريد إلكتروني صحيح' })
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;
}