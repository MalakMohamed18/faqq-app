import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail, IsOptional, MinLength } from 'class-validator';

export class RegisterStep1Dto {
    @IsString()
    @IsNotEmpty()
    business_name: string;

    @IsString()
    @IsNotEmpty()
    business_type: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber('EG')
    phone: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    governorate: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}