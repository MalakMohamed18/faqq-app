import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dtos/create-supplier.dto';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private readonly suppliersRepository: Repository<Supplier>,
    ) { }

    async createSupplier(businessId: string, dto: CreateSupplierDto) {
        const supplier = this.suppliersRepository.create({
            ...dto,
            business: { id: businessId },
        });

        await this.suppliersRepository.save(supplier);

        return {
            message: 'تم إضافة المورد بنجاح',
            supplier,
        };
    }

    async getSuppliers(businessId: string) {
        return this.suppliersRepository.find({
            where: { business: { id: businessId } },
            order: { created_at: 'DESC' },
        });
    }
}