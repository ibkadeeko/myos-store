import { Entity, Column } from 'typeorm';
import BaseEntity from './base';

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true, nullable: false, type: 'varchar' })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  quantity: number;

  @Column({ type: 'numeric' })
  price: number;
}
