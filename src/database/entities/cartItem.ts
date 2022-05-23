import { Entity, ManyToOne, JoinColumn, Unique, Column, Check } from 'typeorm';

import BaseEntity from './base';
import { Product } from './product';
import { Cart } from './cart';

@Entity()
@Unique(['product', 'cart'])
@Check(`"quantity" >= 1`)
export class CartItem extends BaseEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  cart: Cart;
}
