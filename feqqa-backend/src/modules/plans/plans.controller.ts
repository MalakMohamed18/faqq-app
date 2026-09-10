import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';

@ApiTags('Plans')
@Controller('api/plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    // GET: api/plans/active
    @Get('active')
    @ApiOperation({ summary: 'Get all active subscription plans for user onboarding' })
    @ApiResponse({ status: 200, description: 'List of active plans returned successfully' })
    async getAllActivePlans() {
        return this.plansService.getAllActivePlans();
    }

    // GET: api/plans (Admin)
    @Get()
    @ApiOperation({ summary: 'Get all subscription plans (Admin)' })
    async getPlans() {
        return this.plansService.getPlans();
    }

    // GET: api/plans/:id
    @Get(':id')
    @ApiOperation({ summary: 'Get plan details by ID' })
    @ApiResponse({ status: 200, description: 'Plan details returned successfully' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async getPlanById(@Param('id') id: string) {
        return this.plansService.getPlanById(id);
    }

    // POST: api/plans (Admin Only)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new subscription plan (Admin)' })
    @ApiResponse({ status: 201, description: 'Plan created successfully' })
    @ApiResponse({ status: 409, description: 'Plan code already exists' })
    async createPlan(@Body() createPlanDto: CreatePlanDto) {
        return this.plansService.createPlan(createPlanDto);
    }

    // PATCH: api/plans/:id (Admin Only)
    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing subscription plan (Admin)' })
    @ApiResponse({ status: 200, description: 'Plan updated successfully' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async updatePlan(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
        return this.plansService.updatePlan(id, updatePlanDto);
    }

    // PATCH: api/plans/:id/toggle-status
    @Patch(':id/toggle-status')
    @ApiOperation({ summary: 'Toggle plan active status (Enable/Disable)' })
    async togglePlanStatus(@Param('id') id: string) {
        return this.plansService.togglePlanStatus(id);
    }

    // DELETE: api/plans/:id (Admin Only)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a subscription plan (Admin)' })
    @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async deletePlan(@Param('id') id: string) {
        return this.plansService.deletePlan(id);
    }
}