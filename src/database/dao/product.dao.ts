import { QueryRunner } from 'typeorm';
import { getRepoWithQueryRunner } from './dao.util';
import { Product } from '../entities';

const queryForProductsByParams = (qr?: QueryRunner) => {
  return getRepoWithQueryRunner(Product, qr).createQueryBuilder('product');
};

const getProductByParams = async (whereQuery: string, whereParams: any, qr?: QueryRunner) => {
  return queryForProductsByParams(qr).where(whereQuery, whereParams).getOne();
};

export const getProductById = async (id: string, qr?: QueryRunner) => {
  return getProductByParams('product.id = :id', { id }, qr);
};

export const getProductBySlug = async (slug: string, qr?: QueryRunner) => {
  return getProductByParams('product.slug = :slug', { slug }, qr);
};

export const getProductsWithOptions = async (
  options?: { queryString?: string; page?: number; size?: number },
  qr?: QueryRunner
) => {
  const query = queryForProductsByParams(qr);

  if (options?.queryString) {
    query
      .where('product.title ILIKE :queryString', { queryString: `%${options.queryString}%` })
      .orWhere('product.description ILIKE :queryString', { queryString: `%${options.queryString}%` });
  }

  const page = options?.page || 1;
  const size = options?.size || 20;
  const startIndex = (page - 1) * size;

  query.skip(startIndex).take(size).orderBy('product.title', 'ASC');

  const [products, total] = await query.getManyAndCount();

  return { products, total };
};

export const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, qr?: QueryRunner) => {
  const productRepository = getRepoWithQueryRunner(Product, qr);
  const createdProduct = await productRepository.save(productRepository.create(data));
  return getProductById(createdProduct.id, qr);
};

export const createProductIfNotExists = async (
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  qr?: QueryRunner
) => {
  let product = await getProductBySlug(data.slug, qr);
  if (!product) {
    product = await createProduct(data, qr);
  }
  if (!product) {
    throw new Error('Failed to create product');
  }

  return getProductById(product.id, qr);
};
