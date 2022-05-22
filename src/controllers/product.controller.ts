import { Response, Request } from 'express';
import { successResponse, validate } from '../lib';
import { productService } from '../services';
import { getProductDto, getProductsDto } from '../dto';

const getProduct = async (req: Request, res: Response) => {
  const dto = await validate<getProductDto>(req.params, getProductDto);
  const data = await productService.getProduct(dto);
  return successResponse({
    res,
    data,
  });
};

const getProducts = async (req: Request, res: Response) => {
  const dto = await validate<getProductsDto>(req.query, getProductsDto);
  const data = await productService.getProducts(dto);
  return successResponse({
    res,
    data,
  });
};

export default {
  getProduct,
  getProducts,
};
