import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyPhoneDto {
    @IsPhoneNumber('EG')
    phone: string;

    @IsString()
    @Length(4, 6)
    code: string;
}