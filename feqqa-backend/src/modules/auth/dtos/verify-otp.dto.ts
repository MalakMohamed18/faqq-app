import { IsNotEmpty, IsString, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({ example: '+201012345678', description: 'Egyptian phone number' })
    @IsPhoneNumber('EG', { message: 'Phone number must be a valid Egyptian phone number' })
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @ApiProperty({ example: '123456', description: '6-digit OTP code' })
    @IsString({ message: 'OTP must be a string' })
    @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
    otp: string;
}