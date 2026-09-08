import { IsString, IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { PackageType, PaymentMethod } from '../../../utils/enums';

export class ChoosePlanDto {
    @IsString()
    @IsNotEmpty()
    business_id: string;

    @IsEnum(PackageType)
    @IsNotEmpty()
    package_name: string;

    @IsNumber()
    @Min(1)
    duration_months: number;

    @IsNumber()
    price: number;

    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod;
}