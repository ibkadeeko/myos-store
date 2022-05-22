import slugify from 'slugify';

import { httpErrors } from '../lib';
import { createProductIfNotExists, getProductById, getProductsWithOptions } from '../database/dao';
import { getQueryRunner } from './service.util';
import { getProductDto, getProductsDto, createProductDto } from '../dto';
import { formatProductResponse } from '../utils';

const createProduct = async (dto: createProductDto) => {
  const qr = await getQueryRunner();
  await qr.startTransaction('SERIALIZABLE');
  try {
    const { title } = dto;
    const slug = slugify(title, { lower: true, remove: /[*+~.,_\/\\()'"!:;@]/g });

    const createdProduct = await createProductIfNotExists({ ...dto, slug }, qr);

    if (!createdProduct) {
      throw new httpErrors.InternalServerError('Product not created');
    }

    await qr.commitTransaction();

    return formatProductResponse(createdProduct);
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};

const getProduct = async (dto: getProductDto) => {
  const { id } = dto;

  const product = await getProductById(id);

  if (!product) {
    throw new httpErrors.ResourceNotFoundError('Product not found');
  }

  return formatProductResponse(product);
};

const getProducts = async (dto: getProductsDto) => {
  const { keyword: queryString, page, size } = dto;
  const { products, total } = await getProductsWithOptions({ queryString, page, size });

  const formattedProducts = products.map((product) => formatProductResponse(product));

  return { products: formattedProducts, total };
};

export default {
  getProduct,
  getProducts,
  createProduct,
};
