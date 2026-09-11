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
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
// import { UpdateSubscriptionStatusDto } from './dtos/update-subscription-status.dto';
import { SelectPlanDto } from './dto/select-plan.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { JWTPayloadType } from 'src/utils/types';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    // POST: ~/api/subscriptions/select-plan
    @Post('select-plan')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Select a subscription plan for business onboarding' })
    @ApiResponse({ status: 200, description: 'Plan selected or activated successfully' })
    async selectPlan(@CurrentUser() user: JWTPayloadType, @Body() dto: SelectPlanDto) {
        return this.subscriptionsService.selectPlan(user.sub, dto.planId);
    }

    // GET: ~/api/subscriptions/me
    @Get('me')
    @ApiOperation({ summary: 'Get current active subscription for logged-in business' })
    async getMySubscription(@CurrentUser() user: JWTPayloadType) {
        return this.subscriptionsService.getBusinessActiveSubscription(user.sub);
    }

    // GET: api/subscriptions
    @Get()
    @ApiOperation({ summary: 'Get all subscriptions (Admin)' })
    async getAllSubscriptions() {
        return this.subscriptionsService.getAllSubscriptions();
    }

    // GET: api/subscriptions/:id
    @Get(':id')
    @ApiOperation({ summary: 'Get subscription details by ID' })
    async getSubscriptionById(@Param('id', ParseUUIDPipe) id: string) {
        return this.subscriptionsService.getSubscriptionById(id);
    }

    // PATCH: api/subscriptions/:id/status
    // TODO
    // @Patch(':id/status')
    // @ApiOperation({ summary: 'Update subscription status (Admin / Webhook)' })
    // async updateStatus(@Param('id') id: string, @Body() dto: UpdateSubscriptionStatusDto) {
    //     return this.subscriptionsService.updateSubscriptionStatus(id, dto);
    // }

    // DELETE: api/subscriptions/:id
    @Delete(':id')
    @ApiOperation({ summary: 'Delete or cancel subscription' })
    async deleteSubscription(@Param('id') id: string) {
        return this.subscriptionsService.deleteSubscription(id);
    }
}