import * as Faker from 'faker';
import slugify from 'slugify';
import { define } from 'typeorm-seeding';

import { Product } from '../../entities';

define(Product, (faker: typeof Faker) => {
  const product = new Product();
  const title = faker.commerce.productName();
  const slug = slugify(title, { lower: true, remove: /[*+~.,_\/\\()'"!:;@]/g });
  product.title = title;
  product.slug = slug;
  product.description = faker.lorem.paragraph();
  product.imageUrl = faker.image.imageUrl();
  product.price = Number(faker.commerce.price(100));
  product.quantity = faker.random.number({ min: 50, max: 100 });
  return product;
});
