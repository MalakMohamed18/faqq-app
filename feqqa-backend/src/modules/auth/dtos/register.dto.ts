import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Smart Tech LLC', description: 'Name of the business or store' })
    @IsString({ message: 'Business name must be a string' })
    @IsNotEmpty({ message: 'Business name is required' })
    @Transform(({ value }) => value?.trim())
    business_name: string;

    @ApiProperty({ example: 'Retail', description: 'Business category or type' })
    @IsString({ message: 'Business type must be a string' })
    @IsNotEmpty({ message: 'Business type is required' })
    @Transform(({ value }) => value?.trim())
    business_type: string;

    @ApiProperty({ example: 'info@techcompany.com', description: 'Business email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email address is required' })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @ApiProperty({ example: '+201012345678', description: 'Egyptian phone number' })
    @IsPhoneNumber('EG', { message: 'Phone number must be a valid Egyptian phone number' })
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @ApiProperty({ example: 'P@ssword123', description: 'Password (min 8 chars, uppercase, lowercase & digit/special char)' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password cannot exceed 32 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Weak password: must contain uppercase, lowercase, and a number or special character',
    })
    password: string;

    @ApiProperty({ example: 'Cairo', description: 'Governorate / State' })
    @IsString({ message: 'Governorate must be a string' })
    @IsNotEmpty({ message: 'Governorate is required' })
    @Transform(({ value }) => value?.trim())
    governorate: string;

    @ApiProperty({ example: '12 El-Tahrir Street, Dokki', description: 'Detailed street address' })
    @IsString({ message: 'Address must be a string' })
    @IsNotEmpty({ message: 'Address is required' })
    @Transform(({ value }) => value?.trim())
    address: string;
}