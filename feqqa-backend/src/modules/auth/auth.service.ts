import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { BusinessesService } from '../businesses/businesses.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { Business } from '../businesses/entities/business.entity';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from 'src/utils/types';
import { EmailService } from '../notifications/email.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
    private readonly OTP_EXPIRATION_MINUTES = 10;

    constructor(
        private readonly jwtService: JwtService,
        private readonly businessesService: BusinessesService,
        private readonly emailService: EmailService
    ) { }

    public async register(registerDto: RegisterDto) {
        const otp = this.generateSecureOtp();
        const otpExpires = this.getOtpExpirationTime(); // <-- 4. DRY code

        const business = await this.businessesService.createBusiness(registerDto, {
            otp,
            expires: otpExpires,
        });

        this.emailService.sendOtpEmail(business.email, otp).catch(err =>
            console.error(`Failed to send OTP to ${business.email}`, err)
        );

        return {
            message: 'Account created successfully. Please activate your email',
            business_id: business.id,
            email: business.email,
            dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
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
            const newOtp = this.generateSecureOtp();
            const otpExpires = this.getOtpExpirationTime();

            await this.businessesService.updateOtp(business.id, newOtp, otpExpires);

            this.emailService.sendOtpEmail(business.email, newOtp).catch(console.error);

            throw new ForbiddenException({
                statusCode: 403,
                message: 'Account email is not verified. A new OTP has been generated.',
                code: 'EMAIL_NOT_VERIFIED',
                dev_otp: process.env.NODE_ENV !== 'production' ? newOtp : undefined,
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

    public async resendVerificationOtp(email: string) {
        const business = await this.businessesService.findByPhoneOrEmail(email);
        if (!business) throw new NotFoundException('الحساب غير موجود');
        if (business.is_email_verified) throw new BadRequestException('الحساب مفعل بالفعل');

        const newOtp = this.generateSecureOtp();
        const otpExpires = this.getOtpExpirationTime();

        await this.businessesService.updateOtp(business.id, newOtp, otpExpires);
        this.emailService.sendOtpEmail(business.email, newOtp).catch(console.error);

        return { message: 'تم إرسال رمز تحقق جديد بنجاح' };
    }

    public async forgotPassword(email: string) {
        const business = await this.businessesService.findByPhoneOrEmail(email);
        if (!business) throw new NotFoundException('الحساب غير موجود');

        const resetOtp = this.generateSecureOtp();
        const otpExpires = this.getOtpExpirationTime();

        await this.businessesService.updateResetPasswordOtp(business.id, resetOtp, otpExpires);
        this.emailService.sendOtpEmail(business.email, resetOtp).catch(console.error);

        return { message: 'تم إرسال رمز إعادة تعيين كلمة المرور' };
    }

    public async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        const business = await this.businessesService.findByPhoneOrEmail(email);

        if (!business) throw new BadRequestException('البيانات غير صحيحة');

        const isExpired = new Date() > new Date(business.reset_password_expires);
        if (business.reset_password_otp !== otp || isExpired) {
            throw new BadRequestException('رمز التحقق غير صحيح أو انتهت صلاحيته');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.businessesService.updatePasswordAndClearOtp(business.id, hashedPassword);

        return { message: 'تم تغيير كلمة المرور بنجاح' };
    }

    // Generates a cryptographically secure 6-digit OTP
    private generateSecureOtp(): string {
        return randomInt(100000, 999999).toString();
    }

    // Centralizes the math for expiration times
    private getOtpExpirationTime(): Date {
        return new Date(Date.now() + this.OTP_EXPIRATION_MINUTES * 60 * 1000);
    }

    private validateOtpProcess(business: Business, otp: string): void {
        if (!business) {
            throw new BadRequestException('بيانات التفعيل غير صحيحة');
        }

        if (business.is_email_verified) {
            throw new BadRequestException('تم التفعيل بالفعل مسبقاً');
        }

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

        return {
            accessToken: this.jwtService.sign(payload),
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