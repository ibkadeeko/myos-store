import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from './base';
import { Cart } from './cart';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Cart, (cart: Cart) => cart.user)
  carts: Cart[];
}
