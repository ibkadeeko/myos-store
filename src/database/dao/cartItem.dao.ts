import { QueryRunner } from 'typeorm';
import { getRepoWithQueryRunner } from './dao.util';
import { CartItem } from '../entities';

const queryForCartItemByParams = (qr?: QueryRunner) => {
  return getRepoWithQueryRunner(CartItem, qr)
    .createQueryBuilder('cartItem')
    .leftJoin('cartItem.product', 'product')
    .leftJoin('cartItem.cart', 'cart');
};

const getCartItemByParams = async (whereQuery: string, whereParams: any, qr?: QueryRunner) => {
  return queryForCartItemByParams(qr).where(whereQuery, whereParams).getOne();
};

export const getCartItemById = async (id: string, qr?: QueryRunner) => {
  return getCartItemByParams('cartItem.id = :id', { id }, qr);
};

export const getCartItemByCartAndProduct = async (cartId: string, productId: string, qr?: QueryRunner) => {
  return getCartItemByParams('cart.id = :cartId AND product.id = :productId', { cartId, productId }, qr);
};

export const createCartItem = async (data: Pick<CartItem, 'cart' | 'product' | 'quantity'>, qr?: QueryRunner) => {
  const cartItemRepository = getRepoWithQueryRunner(CartItem, qr);
  const createdCartItem = await cartItemRepository.save(cartItemRepository.create(data));
  return getCartItemById(createdCartItem.id, qr);
};

export const updateCartItemById = async (id: string, data: Partial<CartItem>, qr?: QueryRunner) => {
  const cartItemRepository = getRepoWithQueryRunner(CartItem, qr);
  const updatedCartItem = await cartItemRepository.update({ id }, data);
  if (updatedCartItem.affected !== 1) {
    throw new Error('Error updating cartItem');
  }
  return getCartItemById(id, qr);
};

export const addOrUpdateCartItem = async (data: Pick<CartItem, 'cart' | 'product' | 'quantity'>, qr?: QueryRunner) => {
  const cartItem = await getCartItemByCartAndProduct(data.cart.id, data.product.id, qr);
  if (cartItem) {
    return updateCartItemById(cartItem.id, data, qr);
  } else {
    return createCartItem(data, qr);
  }
};

export const removeCartItem = async (id: string, qr?: QueryRunner) => {
  const cartItemRepository = getRepoWithQueryRunner(CartItem, qr);
  const deletedCartItem = await cartItemRepository.delete({ id });
  return deletedCartItem.affected === 1;
};
