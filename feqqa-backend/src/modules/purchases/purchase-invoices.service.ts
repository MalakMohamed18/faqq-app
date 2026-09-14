import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { Supplier } from './entities/supplier.entity';
import { CreatePurchaseInvoiceDto } from './dtos/create-purchase-invoice.dto';
import { InvoiceStatus } from 'src/utils/enums';

@Injectable()
export class PurchaseInvoicesService {
    constructor(
        @InjectRepository(PurchaseInvoice)
        private readonly invoiceRepo: Repository<PurchaseInvoice>,
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
    ) { }

    public async createInvoice(businessId: string, dto: CreatePurchaseInvoiceDto) {
        // 1. Verify the existence of the supplier and confirm that they are affiliated with the same shop.
        const supplier = await this.supplierRepo.findOne({
            where: { id: dto.supplier_id, business: { id: businessId } }
        });

        if (!supplier) {
            throw new NotFoundException('المورد غير موجود أو لا يتبع هذا الحساب');
        }

        // 2. Calculate the total for each item and the grand total of the invoice.
        let totalAmount = 0;
        const items = dto.items.map(item => {
            const totalPrice = item.quantity * item.unit_price;
            totalAmount += totalPrice;

            return {
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: totalPrice,
            };
        });

        // 3. Creating the invoice with its items (TypeORM Cascade Insert)
        const invoice = this.invoiceRepo.create({
            invoice_number: dto.invoice_number,
            invoice_date: dto.invoice_date,
            status: dto.status || InvoiceStatus.UNPAID,
            receipt_url: dto.receipt_url,
            total_amount: totalAmount,
            amount_paid: dto.status === InvoiceStatus.PAID ? totalAmount : 0,
            supplier: supplier,
            business: { id: businessId },
            items: items,// They will be automatically saved in the purchase_invoice_items table.
        });

        await this.invoiceRepo.save(invoice);

        return {
            message: 'تم حفظ الفاتورة بنجاح',
            invoice
        };
    }

    // Retrieve invoices (with filtering by paid and unpaid)
    async getInvoices(businessId: string, status?: InvoiceStatus) {
        const whereCondition: any = { business: { id: businessId } };

        if (status) {
            whereCondition.status = status;
        }

        return this.invoiceRepo.find({
            where: whereCondition,
            relations: {
                supplier: true,
                items: true
            },
            order: { invoice_date: 'DESC' }
        });
    }

    async getPurchasesDashboard(businessId: string) {
        const totalPurchasesResult = await this.invoiceRepo.createQueryBuilder('invoice')
            .where('invoice.businessId = :businessId', { businessId })
            .select('SUM(invoice.total_amount)', 'total')
            .getRawOne();

        const invoicesCount = await this.invoiceRepo.count({ where: { business: { id: businessId } } });
        const suppliersCount = await this.supplierRepo.count({ where: { business: { id: businessId } } });

        const dueInvoices = await this.invoiceRepo.find({
            where: {
                business: { id: businessId },
                status: InvoiceStatus.UNPAID
            },
            relations:{
                supplier: true
            },
            order: { invoice_date: 'ASC' },
            take: 5
        });

        const topSuppliers = await this.invoiceRepo.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.supplier', 'supplier')
            .where('invoice.businessId = :businessId', { businessId })
            .select([
                'supplier.name AS supplier_name',
                'SUM(invoice.total_amount) AS total_dealt'
            ])
            .groupBy('supplier.id')
            .orderBy('total_dealt', 'DESC')
            .limit(3)
            .getRawMany();

        return {
            total_purchases: Number(totalPurchasesResult.total) || 0,
            quick_stats: {
                invoices: invoicesCount,
                suppliers: suppliersCount,
            },
            due_invoices: dueInvoices,
            top_suppliers: topSuppliers.map(ts => ({
                name: ts.supplier_name,
                amount: Number(ts.total_dealt)
            }))
        };
    }
}