import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';
import { StockMovement } from './StockMovement.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  selling_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  purchase_price: number;

  @Column({ type: 'int', default: 0 })
  current_stock: number;

  @Column({ type: 'int', default: 5 })
  minimum_stock: number;

  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany(() => StockMovement, (movement) => movement.product)
  movements: StockMovement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}