import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ default: false })
    is_phone_verified: boolean;

    @Column({ nullable: true })
    verification_code: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}