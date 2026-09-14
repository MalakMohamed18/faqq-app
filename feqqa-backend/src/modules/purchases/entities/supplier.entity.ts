import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { PurchaseInvoice } from './purchase-invoice.entity';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @ManyToOne(() => Business, (business) => business.id)
    business: Business;

    @OneToMany(() => PurchaseInvoice, (invoice) => invoice.supplier)
    invoices: PurchaseInvoice[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}