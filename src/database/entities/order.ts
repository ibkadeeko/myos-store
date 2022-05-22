import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

import BaseEntity from './base';
import { User } from './user';
import { Cart } from './cart';

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum FulfillmentStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

@Entity()
export class Order extends BaseEntity {
  @Column()
  paymentId: boolean;

  @Column({ type: 'jsonb', nullable: true })
  address: ContactAddress;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: FulfillmentStatus, default: FulfillmentStatus.PENDING })
  fulfillmentStatus: FulfillmentStatus;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  cart: Cart;
}
