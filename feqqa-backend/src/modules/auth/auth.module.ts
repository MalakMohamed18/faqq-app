import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../businesses/entities/business.entity';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Business]),
        CommonModule,
        BusinessesModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, TypeOrmModule],
})
export class AuthModule { }