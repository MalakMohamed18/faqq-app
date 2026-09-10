import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plan)
        private readonly plansRepository: Repository<Plan>,
    ) { }

    public async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
        const existingPlan = await this.plansRepository.findOne({
            where: { code: createPlanDto.code },
        });

        if (existingPlan) {
            throw new ConflictException(`Plan with code '${createPlanDto.code}' already exists`);
        }

        const plan = this.plansRepository.create(createPlanDto);
        return await this.plansRepository.save(plan);
    }

    public async getPlans(): Promise<Plan[]> {
        return await this.plansRepository.find();
    }

    public async getAllActivePlans(): Promise<Plan[]> {
        const plans = await this.plansRepository.find({ where: { is_active: true } });
        if (!plans || plans.length === 0) {
            throw new NotFoundException('There are no active plans available right now!');
        }
        return plans;
    }

    public async getPlanById(planId: string): Promise<Plan> {
        const plan = await this.plansRepository.findOne({ where: { id: planId } });
        if (!plan) throw new NotFoundException('Selected plan not found');
        return plan;
    }

    public async updatePlan(planId: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
        const plan = await this.getPlanById(planId);

        if (updatePlanDto.code && updatePlanDto.code !== plan.code) {
            const existingPlan = await this.plansRepository.findOne({
                where: { code: updatePlanDto.code },
            });
            if (existingPlan) {
                throw new ConflictException(`Plan with code '${updatePlanDto.code}' already exists`);
            }
        }

        Object.assign(plan, updatePlanDto);
        return await this.plansRepository.save(plan);
    }

    public async deletePlan(planId: string): Promise<{ message: string }> {
        const plan = await this.getPlanById(planId);
        await this.plansRepository.remove(plan);
        return { message: `Plan '${plan.name}' removed successfully` };
    }

    public async togglePlanStatus(planId: string): Promise<Plan> {
        const plan = await this.getPlanById(planId);
        plan.is_active = !plan.is_active;
        return await this.plansRepository.save(plan);
    }
}