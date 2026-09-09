// src/modules/businesses/businesses.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import { HashingService } from '../../common/services/hashing.service';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessesRepository: Repository<Business>,
        private readonly hashingService: HashingService,
    ) { }

    /**
     * Find a business by phone number or email.
     */
    public async findByPhoneOrEmail(phone: string, email?: string): Promise<Business | null> {
        return this.businessesRepository.findOne({
            where: email ? [{ phone }, { email }] : [{ phone }],
        });
    }

    /**
     * Create a new business account with the provided registration data and optional OTP data.
     */
    public async createBusiness(
        registerDto: RegisterDto, 
        otpData?: { otp: string; expires: Date }
    ): Promise<Business> {
        const { email, phone, password, ...rest } = registerDto;

        const existingBusiness = await this.findByPhoneOrEmail(phone, email);
        if (existingBusiness) {
            throw new ConflictException('حساب التجارة موجود بالفعل بالبريد أو الهاتف المستخدَم');
        }

        const passwordHash = await this.hashingService.hash(password);

        const newBusiness = this.businessesRepository.create({
            ...rest,
            email,
            phone,
            password_hash: passwordHash,
            phone_verification_otp: otpData?.otp,
            phone_verification_expires: otpData?.expires,
        });

        return this.businessesRepository.save(newBusiness);
    }

    /**
     * Mark the phone number of a business as verified and clear the OTP and expiration fields.
     */
    public async markPhoneAsVerified(businessId: string): Promise<void> {
        const result = await this.businessesRepository.update(businessId, {
            is_phone_verified: true,
            phone_verification_otp: null,
            phone_verification_expires: null,
        });

        if (result.affected === 0) {
            throw new NotFoundException('الحساب غير موجود');
        }
    }

    public async findById(businessId: string): Promise<Business> {
        const business = await this.businessesRepository.findOne({ where: { id: businessId } });
        if (!business) {
            throw new NotFoundException('الحساب غير موجود');
        }
        return business;
    }
}