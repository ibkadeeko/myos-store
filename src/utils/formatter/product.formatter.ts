import { Product } from '../../database/entities';

export const formatProductResponse = (product: Product) => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    description: product.description,
    quantity: Number(product.quantity),
  };
};
