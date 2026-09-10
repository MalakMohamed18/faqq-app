import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BusinessesService } from '../businesses/businesses.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { Business } from '../businesses/entities/business.entity';
import { LoginDto } from './dtos/login.dto';
import { OnboardingStatus } from 'src/utils/enums';
import { JWTPayloadType } from 'src/utils/types';

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
            message: 'Account created successfully. Please activate your phone number',
            business_id: business.id,
            phone: business.phone,
            dev_otp: otp,
        };
    }

    public async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const business = await this.businessesService.findByPhoneOrEmail(email);

        if (!business || !business.password_hash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, business.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!business.is_phone_verified) {
            const newOtp = this.generateOtp();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            await this.businessesService.updateOtp(business.id, newOtp, otpExpires);

            throw new ForbiddenException({
                statusCode: 403,
                message: 'Account phone number is not verified. A new OTP has been generated.',
                code: 'PHONE_NOT_VERIFIED',
                dev_otp: newOtp,
            });
        }

        return this.generateAuthResponse(business);
    }

    public async verifyPhone(verifyOtpDto: VerifyOtpDto) {
        const { phone, otp } = verifyOtpDto;
        const business = await this.businessesService.findByPhoneOrEmail(phone);

        this.validateOtpProcess(business, otp);

        const updatedBusiness = await this.businessesService.markPhoneAsVerified(business.id);

        return this.generateAuthResponse(updatedBusiness);
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
        const payload: JWTPayloadType = {
            sub: business.id,
            email: business.email,
            role: business.role,
            onboardingStatus: business.onboarding_status
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            business: {
                id: business.id,
                name: business.business_name,
                email: business.email,
                phone: business.phone,
                onboarding_status: business.onboarding_status,
            },
        };
    }
}