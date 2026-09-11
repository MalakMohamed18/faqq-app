import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { SaleItem } from './sale-item.entity';
import { PaymentStatus } from 'src/utils/enums';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    paid_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    remaining_amount: number;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.FULL })
    payment_status: PaymentStatus;

    @ManyToOne(() => Business, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];

    @CreateDateColumn()
    created_at: Date;
}

export { PaymentStatus };
