import { QueryRunner } from 'typeorm';
import { getRepoWithQueryRunner } from './dao.util';
import { Cart } from '../entities';

const queryForCartByParams = (qr?: QueryRunner) => {
  return getRepoWithQueryRunner(Cart, qr)
    .createQueryBuilder('cart')
    .leftJoinAndSelect('cart.user', 'user')
    .leftJoinAndSelect('cart.cartItems', 'cartItems');
};

const getCartByParams = async (whereQuery: string, whereParams: any, qr?: QueryRunner) => {
  return queryForCartByParams(qr).where(whereQuery, whereParams).getOne();
};

export const getCartById = async (id: string, qr?: QueryRunner) => {
  return getCartByParams('cart.id = :id', { id }, qr);
};

export const getCartByUserId = async (userId: string, qr?: QueryRunner) => {
  return getCartByParams('cart.userId = :userId', { userId }, qr);
};

export const createCart = async (data: Pick<Cart, 'user'>, qr?: QueryRunner) => {
  const cartRepository = getRepoWithQueryRunner(Cart, qr);
  const createdCart = await cartRepository.save(cartRepository.create(data));
  return getCartById(createdCart.id, qr);
};

export const updateCartById = async (id: string, data: Partial<Cart>, qr?: QueryRunner) => {
  const cartRepository = getRepoWithQueryRunner(Cart, qr);
  const updatedCart = await cartRepository.update({ id }, data);
  if (updatedCart.affected !== 1) {
    throw new Error('Error updating cart');
  }
  return getCartById(id, qr);
};

export const deleteCartById = async (id: string, qr?: QueryRunner) => {
  const cartRepository = getRepoWithQueryRunner(Cart, qr);
  const deletedCart = await cartRepository.delete({ id });
  return deletedCart.affected === 1;
};

// export const getCartByProductId = async (productId: string, qr?: QueryRunner) => {
//   return getCartByParams('cart.productId = :productId', { productId }, qr);
// };

// export const getCartByUserIdAndProductId = async (userId: string, productId: string, qr?: QueryRunner) => {
//   return getCartByParams('user.id = :userId AND product.id = :productId', { userId, productId }, qr);
// };

// export const createCartIfNotExists = async (data: Pick<Cart, 'user' | 'product' | 'quantity'>, qr?: QueryRunner) => {
//   const cartRepository = getRepoWithQueryRunner(Cart, qr);

//   const existingCart = await getCartByUserIdAndProductId(data.user.id, data.product.id, qr);

//   if (existingCart) {
//     return existingCart;
//   }

//   const createdCart = await cartRepository.save(cartRepository.create(data));
//   return getCartById(createdCart.id, qr);
// };

// export const getAllUserCarts = async (userId: string, qr?: QueryRunner) => {
//   return queryForCartByParams(qr).where('user.id = :userId', { userId }).getMany();
// };
