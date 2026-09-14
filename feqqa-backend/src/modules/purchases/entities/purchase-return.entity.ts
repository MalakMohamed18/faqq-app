import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { Supplier } from './supplier.entity';

@Entity('purchase_returns')
export class PurchaseReturn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_name: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    refund_amount: number;

    @Column({ nullable: true })
    return_reason: string;

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @ManyToOne(() => Business)
    business: Business;

    @CreateDateColumn()
    created_at: Date;
}