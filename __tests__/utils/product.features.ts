import faker from '@faker-js/faker';

import { productService } from '../../src/services';

export const getProductData = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  quantity: faker.datatype.number({ max: 100, min: 50 }),
  imageUrl: faker.image.imageUrl(),
  price: Number(faker.commerce.price(1, 100, 2)),
});

export const seedProducts = async (number: number): Promise<void> => {
  try {
    const array = new Array(number).fill(0);
    for (const num of array) {
      await productService.createProduct(getProductData());
    }
  } catch (error) {
    console.error('error', error);
  }
};
