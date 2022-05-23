import { Cart } from '../../database/entities';

export const formatCartResponse = (cart: Cart) => {
  return {
    id: cart.id,
    status: cart.status,
    subTotal: cart.subTotal,
    total: cart.total,
    discount: cart.discount,
    items: cart.cartItems.map((item) => ({
      id: item.id,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        description: item.product.description,
      },
      quantity: item.quantity,
    })),
  };
};
