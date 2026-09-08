import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { PaymentMethod, SubscriptionStatus } from '../../../utils/enums';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    business_id: string;

    @Column()
    package_name: string;

    @Column({ type: 'int' })
    duration_months: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column({ type: 'timestamp', nullable: true })
    start_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    end_date: Date;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING_VERIFICATION })
    status: SubscriptionStatus;

    @ManyToOne(() => Business, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @CreateDateColumn()
    created_at: Date;
}