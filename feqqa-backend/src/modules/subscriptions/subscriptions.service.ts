import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { BusinessesService } from '../businesses/businesses.service';
import { PlansService } from '../plans/plan.service';
import { OnboardingStatus, SubscriptionStatus } from 'src/utils/enums';
// TODO: CHECK THISOUT
// import { UpdateSubscriptionStatusDto } from './dtos/update-subscription-status.dto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        private readonly businessesService: BusinessesService,
        private readonly plansService: PlansService,
    ) { }

    // 1. Create / Select Plan
    public async selectPlan(businessId: string, planId: string) {
        const business = await this.businessesService.findById(businessId);
        const plan = await this.plansService.getPlanById(planId);

        if (Number(plan.price) === 0) {
            const subscription = this.subscriptionRepository.create({
                business,
                plan,
                status: SubscriptionStatus.ACTIVE,
                starts_at: new Date(),
                expires_at: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000),
            });

            await this.subscriptionRepository.save(subscription);
            await this.businessesService.updateOnboardingStatus(businessId, OnboardingStatus.COMPLETED);

            return { message: 'Free plan activated successfully', status: OnboardingStatus.COMPLETED };
        }

        await this.businessesService.updateOnboardingStatus(businessId, OnboardingStatus.PENDING_PAYMENT);

        return {
            message: 'Plan selected. Please proceed to payment',
            status: OnboardingStatus.PENDING_PAYMENT,
            amount: plan.price,
        };
    }

    // 2. Read All
    public async getAllSubscriptions(): Promise<Subscription[]> {
        return await this.subscriptionRepository.find({
            relations: {
                business: true,
                plan: true
            },
            order: { created_at: 'DESC' },
        });
    }

    // 3. Read Current (جلب الاشتراك الحالي للنشاط التجاري)
    public async getBusinessActiveSubscription(businessId: string): Promise<Subscription> {
        const subscription = await this.subscriptionRepository.findOne({
            where: {
                business: { id: businessId },
                status: SubscriptionStatus.ACTIVE,
            },
            relations: {
                plan: true
            },
            order: { expires_at: 'DESC' },
        });

        if (!subscription) {
            throw new NotFoundException('No active subscription found for this business');
        }

        return subscription;
    }

    // 4. Read One By ID (جلب تفاصيل اشتراك محدد)
    public async getSubscriptionById(id: string): Promise<Subscription> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
            relations: {
                business: true,
                plan: true
            },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        return subscription;
    }

    // 5. Update Status 
    // TODO
    // public async updateSubscriptionStatus(id: string, dto: UpdateSubscriptionStatusDto): Promise<Subscription> {
    //     const subscription = await this.getSubscriptionById(id);
    //     subscription.status = dto.status;

    //     // إذا تم التفعيل، قم بتحديث حالة الـ Onboarding للبزنس تلقائياً
    //     if (dto.status === SubscriptionStatus.ACTIVE) {
    //         await this.businessesService.updateOnboardingStatus(
    //             subscription.business.id,
    //             OnboardingStatus.COMPLETED
    //         );
    //     }

    //     return await this.subscriptionRepository.save(subscription);
    // }

    // 6. Delete / Cancel
    public async deleteSubscription(id: string): Promise<{ message: string }> {
        const subscription = await this.getSubscriptionById(id);
        await this.subscriptionRepository.remove(subscription);
        return { message: 'Subscription deleted successfully' };
    }

    // 7. Check Active Status
    public async hasActiveSubscription(businessId: string): Promise<boolean> {
        const activeSubscription = await this.subscriptionRepository.findOne({
            where: {
                business: { id: businessId },
                status: SubscriptionStatus.ACTIVE,
            },
            order: { expires_at: 'DESC' },
        });

        if (!activeSubscription) return false;

        return activeSubscription.expires_at > new Date();
    }
}