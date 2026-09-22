import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthEmailDto } from './dtos/forgot-password.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // ~/api/auth/register
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new business and send verification OTP' })
    @ApiResponse({ status: 201, description: 'Business created successfully and OTP sent' })
    @ApiResponse({ status: 400, description: 'Invalid input payload' })
    @ApiResponse({ status: 409, description: 'Email or phone number already in use' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // ~/api/auth/verify-email
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP code via email and activate business account' })
    @ApiResponse({ status: 200, description: 'Account verified successfully and access token returned' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
    async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyEmail(verifyOtpDto);
    }

    // ~/api/auth/login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in to business account' })
    @ApiResponse({ status: 200, description: 'Successfully authenticated and token returned' })
    @ApiResponse({ status: 400, description: 'Invalid input payload' })
    @ApiResponse({ status: 401, description: 'Invalid credentials or unverified account' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // ~/api/auth/resend-otp
    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend email verification OTP' })
    @ApiResponse({ status: 200, description: 'New verification OTP sent successfully' })
    @ApiResponse({ status: 400, description: 'Account is already verified' })
    @ApiResponse({ status: 404, description: 'Business account not found' })
    async resendOtp(@Body() authEmailDto: AuthEmailDto) {
        return this.authService.resendVerificationOtp(authEmailDto.email);
    }

    // ~/api/auth/forgot-password
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request an OTP to reset password' })
    @ApiResponse({ status: 200, description: 'Password reset OTP sent successfully' })
    @ApiResponse({ status: 404, description: 'Business account not found' })
    async forgotPassword(@Body() authEmailDto: AuthEmailDto) {
        return this.authService.forgotPassword(authEmailDto.email);
    }

    // ~/api/auth/reset-password
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password using OTP' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}