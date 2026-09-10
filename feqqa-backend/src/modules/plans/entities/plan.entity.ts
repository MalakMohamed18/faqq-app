import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: 30 })
    duration_days: number;

    @Column({ default: 1 })
    max_branches: number;

    @Column({ default: 20 })
    max_invoices_per_month: number;

    @Column({ default: false })
    has_ai_copilot: boolean;

    @Column({ default: false })
    has_demand_forecast: boolean;

    @Column({ default: false })
    has_dedicated_support: boolean;

    @Column()
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}