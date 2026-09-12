import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiDataController } from './ai-data.controller';
import { AiDataService } from './ai-data.service';
import { Sale } from '../sales/entities/sale.entity';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale]),
        ProductsModule,
        CustomersModule,
        ExpensesModule,
        JwtModule
    ],
    controllers: [AiDataController],
    providers: [AiDataService],
    exports: [AiDataService],
})
export class AiDataModule { }