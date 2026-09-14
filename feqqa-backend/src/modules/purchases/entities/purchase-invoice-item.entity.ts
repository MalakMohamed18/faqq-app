import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PurchaseInvoice } from './purchase-invoice.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('purchase_invoice_items')
export class PurchaseInvoiceItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_name: string;

    @ManyToOne(() => Product, { nullable: true })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @ManyToOne(() => PurchaseInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
    invoice: PurchaseInvoice;
}