import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlansModule } from './modules/plans/plans.module';
import { SalesModule } from './modules/sales/sales.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { AiDataModule } from './modules/ai-data/ai-data.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    CommonModule,
    AuthModule,
    BusinessesModule,
    SubscriptionsModule,
    PlansModule,
    SalesModule,
    ProductsModule,
    CustomersModule,
    ExpensesModule,
    AiDataModule,
    UploadsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }