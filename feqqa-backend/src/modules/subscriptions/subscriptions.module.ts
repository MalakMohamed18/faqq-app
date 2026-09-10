import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { PlansModule } from '../plans/plans.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
        JwtModule,
        PlansModule,
        BusinessesModule
    ],
    providers: [SubscriptionsService],
    controllers: [SubscriptionsController],
    exports: [TypeOrmModule, SubscriptionsService],
})
export class SubscriptionsModule { }
