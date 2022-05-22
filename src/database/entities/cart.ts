import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';

import BaseEntity from './base';
import { User } from './user';
import { CartItem } from './cartItem';

export enum CartStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Cart extends BaseEntity {
  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.OPEN,
  })
  status: CartStatus;

  @Column({ default: 0 })
  subTotal: number;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  discount: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
