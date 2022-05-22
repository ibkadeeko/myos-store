import { Product } from '../../database/entities';

export const formatProductResponse = (product: Product) => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
  };
};
