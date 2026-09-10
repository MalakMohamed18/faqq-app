import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { SubscriptionStatus } from 'src/utils/enums';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Business, (b) => b.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING_PAYMENT })
    status: SubscriptionStatus;

    @Column({ type: 'timestamp' })
    starts_at: Date;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @CreateDateColumn()
    created_at: Date;
}