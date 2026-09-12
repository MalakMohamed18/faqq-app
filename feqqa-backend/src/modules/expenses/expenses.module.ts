import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense]),
        JwtModule
    ],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService, TypeOrmModule],
})
export class ExpensesModule { }