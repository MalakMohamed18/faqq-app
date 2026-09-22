import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'owner@business.com' })
    @IsEmail({}, { message: 'يجب إدخال بريد إلكتروني صحيح' })
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'رمز التحقق مطلوب' })
    otp: string;

    @ApiProperty({ example: 'newPassword123' })
    @IsString()
    @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    newPassword: string;
}