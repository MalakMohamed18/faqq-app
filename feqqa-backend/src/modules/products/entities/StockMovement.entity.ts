import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { MovementType } from 'src/utils/enums';

@Entity('stock_movements')
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column({ type: 'int' })
    quantity_change: number;

    @Column({ type: 'int' })
    resulting_stock: number;

    @Column({ nullable: true })
    reference_id: string;

    @ManyToOne(() => Product, (product) => product.movements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @CreateDateColumn()
    created_at: Date;
}