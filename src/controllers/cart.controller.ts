import { Response } from 'express';
import { successResponse, validate } from '../lib';
import { cartService } from '../services';
import { addToCartDto, getCartDto, removeCartItemDto, checkoutCartDto } from '../dto';
import { AuthenticatedRequest } from '../utils';

const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const dto = await validate<addToCartDto>(
    {
      ...req.body,
      cartId: req.params.id,
      userId: req.decodedToken.userId,
    },
    addToCartDto
  );
  const data = await cartService.addToCart(dto);
  return successResponse({
    res,
    data,
  });
};

const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const dto = await validate<getCartDto>(
    {
      cartId: req.params.id,
      userId: req.decodedToken.userId,
    },
    getCartDto
  );
  const data = await cartService.getCart(dto);
  return successResponse({
    res,
    data,
  });
};

const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  const dto = await validate<removeCartItemDto>(
    {
      cartId: req.params.id,
      cartItemId: req.params.itemId,
      userId: req.decodedToken.userId,
    },
    removeCartItemDto
  );
  const data = await cartService.removeFromCart(dto);
  return successResponse({
    res,
    data,
  });
};

const checkoutCart = async (req: AuthenticatedRequest, res: Response) => {
  const dto = await validate<checkoutCartDto>(
    {
      ...req.body,
      cartId: req.params.id,
      userId: req.decodedToken.userId,
    },
    checkoutCartDto
  );
  const data = await cartService.checkoutCart(dto);
  return successResponse({
    res,
    data,
  });
};

export default {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
};
