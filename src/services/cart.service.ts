import { httpErrors } from '../lib';
import {
  getProductById,
  getCartById,
  createCart,
  getUserById,
  getUserOpenCart,
  addOrUpdateCartItem,
  removeCartItem,
  createOrder,
  updateProductById,
  updateCartById,
} from '../database/dao';
import { getQueryRunner } from './service.util';
import { addToCartDto, getCartDto, removeCartItemDto, checkoutCartDto } from '../dto';
import { formatCartResponse } from '../utils';
import { Cart, CartStatus } from '../database/entities';
import { QueryRunner } from 'typeorm';

const updateCartTotal = async (cart: Cart, qr: QueryRunner) => {
  const subTotal = cart.cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const total = subTotal - cart.discount;
  return updateCartById(cart.id, { subTotal, total }, qr);
};

const addToCart = async (dto: addToCartDto) => {
  const qr = await getQueryRunner();
  await qr.startTransaction();
  try {
    const { userId, cartId, productId, quantity } = dto;

    const user = await getUserById(userId, qr);
    if (!user) {
      throw new httpErrors.ResourceNotFoundError('User not found');
    }

    const product = await getProductById(productId, qr);
    if (!product) {
      throw new httpErrors.ResourceNotFoundError('Product not found');
    }

    let cart: Cart | undefined;
    if (cartId) {
      cart = await getCartById(cartId);
      if (!cart) {
        throw new httpErrors.ResourceNotFoundError('Cart not found');
      }
      if (cart.status !== CartStatus.OPEN) {
        throw new httpErrors.BadRequestError('Cart is not open');
      }
    } else {
      cart = await getUserOpenCart(userId, qr);
      if (!cart) {
        cart = await createCart({ user }, qr);
        if (!cart) {
          throw new httpErrors.InternalServerError('Cart not created');
        }
      }
    }

    const cartItem = await addOrUpdateCartItem({ cart, product, quantity }, qr);
    if (!cartItem) {
      throw new httpErrors.InternalServerError('CartItem not added');
    }

    const updatedCart = await getCartById(cart.id, qr);
    if (!updatedCart) {
      throw new httpErrors.InternalServerError('Cart not found');
    }

    const cartWithUpdatedTotal = await updateCartTotal(updatedCart, qr);
    if (!cartWithUpdatedTotal) {
      throw new httpErrors.InternalServerError('Cart total not updated');
    }

    await qr.commitTransaction();

    return formatCartResponse(cartWithUpdatedTotal);
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};

const getCart = async (dto: getCartDto) => {
  const qr = await getQueryRunner();
  try {
    const { userId, cartId } = dto;

    const user = await getUserById(userId, qr);
    if (!user) {
      throw new httpErrors.ResourceNotFoundError('User not found');
    }

    let cart: Cart | undefined;
    if (cartId) {
      cart = await getCartById(cartId);
      if (!cart) {
        throw new httpErrors.ResourceNotFoundError('Cart not found');
      }
    } else {
      cart = await getUserOpenCart(userId, qr);
      if (!cart) {
        throw new httpErrors.ResourceNotFoundError('Cart not found');
      }
    }

    return formatCartResponse(cart);
  } finally {
    await qr.release();
  }
};

const removeFromCart = async (dto: removeCartItemDto) => {
  const qr = await getQueryRunner();
  await qr.startTransaction();
  try {
    const { userId, cartId, cartItemId } = dto;

    const user = await getUserById(userId, qr);
    if (!user) {
      throw new httpErrors.ResourceNotFoundError('User not found');
    }

    const cart = await getCartById(cartId, qr);
    if (!cart) {
      throw new httpErrors.ResourceNotFoundError('Cart not found');
    }
    if (cart.status !== CartStatus.OPEN) {
      throw new httpErrors.BadRequestError('Cart is not open');
    }

    const cartItemBelongsToCart = !!cart.cartItems.find((item) => item.id === cartItemId);
    if (!cartItemBelongsToCart) {
      throw new httpErrors.ResourceNotFoundError('CartItem not found');
    }

    const cartItem = await removeCartItem(cartItemId, qr);
    if (!cartItem) {
      throw new httpErrors.InternalServerError('CartItem not removed');
    }

    const updatedCart = await getCartById(cart.id, qr);
    if (!updatedCart) {
      throw new httpErrors.InternalServerError('Cart not found');
    }

    const cartWithUpdatedTotal = await updateCartTotal(updatedCart, qr);
    if (!cartWithUpdatedTotal) {
      throw new httpErrors.InternalServerError('Cart total not updated');
    }

    await qr.commitTransaction();

    return formatCartResponse(cartWithUpdatedTotal);
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};

const checkoutCart = async (dto: checkoutCartDto) => {
  const qr = await getQueryRunner();
  await qr.startTransaction('SERIALIZABLE');
  try {
    const { userId, cartId, paymentId, address } = dto;

    const user = await getUserById(userId, qr);
    if (!user) {
      throw new httpErrors.ResourceNotFoundError('User not found');
    }

    const cart = await getCartById(cartId, qr);
    if (!cart) {
      throw new httpErrors.ResourceNotFoundError('Cart not found');
    }
    if (cart.status !== CartStatus.OPEN) {
      throw new httpErrors.BadRequestError('Cart is not open');
    }

    if (cart.user.id !== user.id) {
      throw new httpErrors.BadRequestError('Cart does not belong to user');
    }

    const { cartItems } = cart;
    if (!cartItems || cartItems.length === 0) {
      throw new httpErrors.BadRequestError('Cart is empty');
    }

    const updatedProducts = await Promise.all(
      cartItems.map(async (cartItem) => {
        const { product, quantity } = cartItem;
        if (product.quantity < quantity) {
          throw new httpErrors.BadRequestError(
            `Product ${product.title} is out of stock. Available quantity: ${product.quantity}`
          );
        }
        return updateProductById(product.id, { quantity: product.quantity - quantity }, qr);
      })
    );

    if (!updatedProducts || updatedProducts.some((product) => !product)) {
      throw new httpErrors.InternalServerError('Products not updated');
    }

    const updatedCart = await updateCartById(cart.id, { status: CartStatus.COMPLETED }, qr);
    if (!updatedCart) {
      throw new httpErrors.InternalServerError('Cart not updated');
    }

    const order = await createOrder({ cart, paymentId, address, user }, qr);
    if (!order) {
      throw new httpErrors.InternalServerError('Order not created');
    }

    await qr.commitTransaction();

    return {
      ...order,
      cart: formatCartResponse(updatedCart),
    };
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};

export default {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
};
