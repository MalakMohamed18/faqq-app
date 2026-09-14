import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { Supplier } from './supplier.entity';
import { PurchaseInvoiceItem } from './purchase-invoice-item.entity';
import { InvoiceStatus } from 'src/utils/enums';

@Entity('purchase_invoices')
export class PurchaseInvoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    invoice_number: string;

    @Column({ type: 'date' })
    invoice_date: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount_paid: number;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
    status: InvoiceStatus;

    @Column({ nullable: true })
    receipt_url: string;

    @ManyToOne(() => Business, (business) => business.id)
    business: Business;

    @ManyToOne(() => Supplier, (supplier) => supplier.invoices)
    supplier: Supplier;

    @OneToMany(() => PurchaseInvoiceItem, (item) => item.invoice, { cascade: true })
    items: PurchaseInvoiceItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}