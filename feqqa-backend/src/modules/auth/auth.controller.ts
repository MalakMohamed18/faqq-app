import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

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

    // ~/api/auth/verify-phone
    @Post('verify-phone')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP code and activate business account' })
    @ApiResponse({ status: 200, description: 'Account verified successfully and access token returned' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
    async verifyPhone(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyPhone(verifyOtpDto);
    }
}