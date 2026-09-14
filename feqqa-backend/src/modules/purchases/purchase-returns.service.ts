import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseReturn } from './entities/purchase-return.entity';
import { Supplier } from './entities/supplier.entity';
import { CreatePurchaseReturnDto } from './dtos/create-purchase-return.dto';

@Injectable()
export class PurchaseReturnsService {
    constructor(
        @InjectRepository(PurchaseReturn)
        private readonly returnsRepo: Repository<PurchaseReturn>,
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
    ) { }

    async createReturn(businessId: string, dto: CreatePurchaseReturnDto) {
        const supplier = await this.supplierRepo.findOne({
            where: { id: dto.supplier_id, business: { id: businessId } }
        });

        if (!supplier) {
            throw new NotFoundException('المورد غير موجود');
        }

        const purchaseReturn = this.returnsRepo.create({
            product_name: dto.product_name,
            quantity: dto.quantity,
            refund_amount: dto.refund_amount,
            return_reason: dto.return_reason,
            supplier: supplier,
            business: { id: businessId },
        });

        await this.returnsRepo.save(purchaseReturn);

        return {
            message: 'تم تسجيل المرتجع بنجاح',
            purchaseReturn,
        };
    }

    async getReturns(businessId: string) {
        return this.returnsRepo.find({
            where: { business: { id: businessId } },
            relations: {
                supplier: true
            },
            order: { created_at: 'DESC' },
        });
    }

    async deleteReturn(businessId: string, returnId: string) {
        const purchaseReturn = await this.returnsRepo.findOne({
            where: { id: returnId, business: { id: businessId } }
        });

        if (!purchaseReturn) {
            throw new NotFoundException('المرتجع غير موجود');
        }

        await this.returnsRepo.remove(purchaseReturn);

        return { message: 'تم حذف المرتجع بنجاح' };
    }
}