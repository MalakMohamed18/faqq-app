import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BusinessesService } from '../businesses/businesses.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { Business } from '../businesses/entities/business.entity';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from 'src/utils/types';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly businessesService: BusinessesService,
        private readonly emailService: EmailService
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

        // Send OTP process
        await this.emailService.sendOtpEmail(business.email, otp);

        return {
            message: 'Account created successfully. Please activate your email',
            business_id: business.id,
            email: business.email,
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

        if (!business.is_email_verified) {
            const newOtp = this.generateOtp();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            // Update OTP
            await this.businessesService.updateOtp(business.id, newOtp, otpExpires);

            // Send new OTP
            await this.emailService.sendOtpEmail(business.email, newOtp);

            throw new ForbiddenException({
                statusCode: 403,
                message: 'Account email is not verified. A new OTP has been generated.',
                code: 'EMIAL_NOT_VERIFIED',
                dev_otp: newOtp,
            });
        }

        return this.generateAuthResponse(business);
    }

    public async verifyEmail(verifyOtpDto: VerifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const business = await this.businessesService.findByPhoneOrEmail(email);

        this.validateOtpProcess(business, otp);

        const updatedBusiness = await this.businessesService.markEmailAsVerified(business.id);

        return this.generateAuthResponse(updatedBusiness);
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private validateOtpProcess(business: Business, otp: string): void {
        if (!business) {
            throw new BadRequestException('بيانات التفعيل غير صحيحة');
        }

        if (business.is_email_verified) {
            throw new BadRequestException('تم التفعيل بالفعل مسبقاً');
        }

        // Check if the OTP matches and is not expired
        const isExpired = new Date() > new Date(business.email_verification_expires);
        if (business.email_verification_otp !== otp || isExpired) {
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