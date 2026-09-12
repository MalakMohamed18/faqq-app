import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: false })
    category: string;

    @Column({ type: 'date' })
    expense_date: Date;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    receipt_url: string;

    @ManyToOne(() => Business, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}