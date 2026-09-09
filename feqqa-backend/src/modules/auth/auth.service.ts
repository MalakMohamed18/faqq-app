import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessesService } from '../businesses/businesses.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { Business } from '../businesses/entities/business.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly businessesService: BusinessesService,
    ) { }


    public async register(registerDto: RegisterDto) {
        // Generate OTP and set expiration time (10 minutes from now)
        const otp = this.generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Create the business account with the OTP and expiration time
        const business = await this.businessesService.createBusiness(registerDto, {
            otp,
            expires: otpExpires,
        });

        return {
            message: 'تم إنشاء الحساب بنجاح، يرجى تفعيل رقم الهاتف',
            business_id: business.id,
            phone: business.phone,
            dev_otp: otp,
        };
    }

    public async verifyPhone(verifyOtpDto: VerifyOtpDto) {
        // Find the business by phone number and validate the OTP
        const { phone, otp } = verifyOtpDto;
        const business = await this.businessesService.findByPhoneOrEmail(phone);

        // Validate the OTP process
        this.validateOtpProcess(business, otp);

        // Mark the phone as verified and clear the OTP and expiration fields
        await this.businessesService.markPhoneAsVerified(business.id);

        return this.generateAuthResponse(business);
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private validateOtpProcess(business: Business, otp: string): void {
        if (!business) {
            throw new BadRequestException('بيانات التفعيل غير صحيحة');
        }

        if (business.is_phone_verified) {
            throw new BadRequestException('تم التفعيل بالفعل مسبقاً');
        }

        // Check if the OTP matches and is not expired
        const isExpired = new Date() > new Date(business.phone_verification_expires);
        if (business.phone_verification_otp !== otp || isExpired) {
            throw new BadRequestException('رمز التحقق غير صحيح أو انتهت صلاحيته');
        }
    }

    private generateAuthResponse(business: Business) {
        const payload = { sub: business.id, email: business.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            business: {
                id: business.id,
                name: business.business_name,
                email: business.email,
                phone: business.phone,
            },
        };
    }
}