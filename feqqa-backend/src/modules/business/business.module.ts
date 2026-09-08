import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Business])
    ],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class BusinessModule {}
