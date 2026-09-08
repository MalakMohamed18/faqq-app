import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('businesses')
export class Business {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    business_type: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    governorate: string;

    @Column({ type: 'text', nullable: false })
    address: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}