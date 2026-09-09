import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { BusinessesService } from './businesses.service';
import { CommonModule } from 'src/common/common.module';
import { BusinessesController } from './businesses.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Business]),
        CommonModule,
    ],
    providers: [BusinessesService],
    controllers: [BusinessesController],
    exports: [TypeOrmModule, BusinessesService],
})
export class BusinessesModule { }