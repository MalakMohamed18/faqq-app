import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SubscriptionsService } from "src/modules/subscriptions/subscriptions.service";

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
    constructor(
        private readonly subscriptionsService: SubscriptionsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.sub) {
            return false;
        }

        const hasActiveSubscription = await this.subscriptionsService.hasActiveSubscription(user.sub);

        if (!hasActiveSubscription) {
            throw new ForbiddenException({
                message: 'Your subscription is inactive or has expired. Please renew your plan.',
                code: 'SUBSCRIPTION_REQUIRED',
            });
        }

        return true;
    }
}