import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer]),
        JwtModule
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
    exports: [CustomersService, TypeOrmModule],
})
export class CustomersModule { }