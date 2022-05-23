import { QueryRunner } from 'typeorm';
import { getRepoWithQueryRunner } from './dao.util';
import { Order } from '../entities';

const queryForOrderByParams = (qr?: QueryRunner) => {
  return getRepoWithQueryRunner(Order, qr)
    .createQueryBuilder('order')
    .leftJoin('order.user', 'user')
    .leftJoinAndSelect('order.cart', 'cart')
    .leftJoinAndSelect('cart.cartItems', 'cartItems')
    .leftJoinAndSelect('cartItems.product', 'product');
};

const getOrderByParams = async (whereQuery: string, whereParams: any, qr?: QueryRunner) => {
  return queryForOrderByParams(qr).where(whereQuery, whereParams).getOne();
};

export const getOrderById = async (id: string, qr?: QueryRunner) => {
  return getOrderByParams('order.id = :id', { id }, qr);
};

export const createOrder = async (data: Pick<Order, 'paymentId' | 'cart' | 'address' | 'user'>, qr?: QueryRunner) => {
  const orderRepository = getRepoWithQueryRunner(Order, qr);
  const createdOrder = await orderRepository.save(orderRepository.create(data));
  return getOrderById(createdOrder.id, qr);
};

export const updateOrderById = async (id: string, data: Partial<Order>, qr?: QueryRunner) => {
  const orderRepository = getRepoWithQueryRunner(Order, qr);
  const updatedOrder = await orderRepository.update({ id }, data);
  if (updatedOrder.affected !== 1) {
    throw new Error('Error updating order');
  }
  return getOrderById(id, qr);
};

export const deleteOrderById = async (id: string, qr?: QueryRunner) => {
  const orderRepository = getRepoWithQueryRunner(Order, qr);
  const deletedOrder = await orderRepository.delete({ id });
  return deletedOrder.affected === 1;
};

export const getAllUserOrders = async (userId: string, qr?: QueryRunner) => {
  return queryForOrderByParams(qr).where('order.user.id = :userId', { userId }).getMany();
};
