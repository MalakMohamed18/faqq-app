import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({ example: 'ahmed@feqqa.app', description: 'Business email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email address is required' })
    email: string;

    @ApiProperty({ example: '123456', description: '6-digit OTP code' })
    @IsString({ message: 'OTP must be a string' })
    @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
    otp: string;
}