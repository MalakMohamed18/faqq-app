import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import { HashingService } from '../../common/services/hashing.service';
import { OnboardingStatus } from 'src/utils/enums';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessesRepository: Repository<Business>,
        private readonly hashingService: HashingService,
    ) { }

    /**
     * Find a business by phone number or email.
     * If only one parameter is provided, it checks both fields against that single input value.
     */
    public async findByPhoneOrEmail(identifier: string, secondIdentifier?: string): Promise<Business | null> {
        const term1 = identifier;
        const term2 = secondIdentifier || identifier;

        return this.businessesRepository.findOne({
            where: [
                { phone: term1 },
                { email: term1 },
                { phone: term2 },
                { email: term2 },
            ],
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
            throw new ConflictException('A business account already exists for the email or phone number used');
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
     * Update OTP code and expiration time for a specific business.
     */
    public async updateOtp(businessId: string, otp: string, expires: Date): Promise<void> {
        const result = await this.businessesRepository.update(businessId, {
            phone_verification_otp: otp,
            phone_verification_expires: expires,
        });

        if (result.affected === 0) {
            throw new NotFoundException('Account does not exist');
        }
    }

    /**
     * Mark the phone number of a business as verified and clear the OTP and expiration fields.
     * Move to the next step is Payment Step
     */
    async markPhoneAsVerified(businessId: string) {
        await this.businessesRepository.update(businessId, {
            is_phone_verified: true,
            phone_verification_otp: null,
            phone_verification_expires: null,
        });

        await this.updateOnboardingStatus(businessId, OnboardingStatus.SELECT_PLAN)
        return this.findById(businessId);
    }

    /**
     * This Function use while user create account
     */
    async updateOnboardingStatus(businessId: string, status: OnboardingStatus) {
        await this.businessesRepository.update(businessId, {
            onboarding_status: status,
        });
        return this.findById(businessId);
    }

    /**
     * Find a business by its ID.
     */
    public async findById(businessId: string): Promise<Business> {
        const business = await this.businessesRepository.findOne({ where: { id: businessId } });
        if (!business) {
            throw new NotFoundException('Account does not exist');
        }
        return business;
    }
}