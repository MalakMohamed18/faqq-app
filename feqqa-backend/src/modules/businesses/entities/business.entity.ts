import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('businesses')
export class Business {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: false })
    business_name: string;

    @Column({ nullable: false })
    business_type: string;

    @Column({ nullable: false })
    governorate: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    password_hash: string;

    @Column({ default: false })
    is_phone_verified: boolean;

    @Column({ nullable: true })
    phone_verification_otp: string;

    @Column({ type: 'timestamp', nullable: true })
    phone_verification_expires: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}