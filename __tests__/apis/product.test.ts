import { assert } from 'chai';
import supertest from 'supertest';
import faker from '@faker-js/faker';

import app from '../../src/app';
import { seedProducts, getProductData } from '../utils';
import { productService } from '../../src/services';

const server = supertest.agent(app);

describe('Product Router', function () {
  let product: any;
  before(async function beforeHook() {
    await seedProducts(50);
  });

  describe('GET /products', () => {
    it('should return all products', async () => {
      const res = await server.get('/products');

      assert.equal(res.status, 200);
      assert.isArray(res.body.products);
      assert.equal(res.body.products.length, 20);
      assert.equal(res.body.total, 50);
    });

    it('should return all products with pagination', async function () {
      const res = await server.get('/products?size=30');

      assert.equal(res.status, 200);
      assert.isArray(res.body.products);
      assert.equal(res.body.products.length, 30);
      assert.equal(res.body.total, 50);
    });

    it('should return all products with pagination', async () => {
      const res = await server.get('/products?page=2&size=30');

      assert.equal(res.status, 200);
      assert.isArray(res.body.products);
      assert.equal(res.body.products.length, 20);
      assert.equal(res.body.total, 50);
    });

    it('should return all products that match the keyword', async () => {
      const productData = {
        ...getProductData(),
        title: 'Elizabeth Gilbert: A Biography',
        description: 'Elizabeth Gilbert is a British writer, novelist, and memoirist. She is best known for her novel The Handmaid\'s Tale (2016), which was nominated for the Booker Prize in 2017.',
      };
      product = await productService.createProduct(productData);
      const res = await server.get('/products?page=1&size=10&keyword=gilbert');

      assert.equal(res.status, 200);
      assert.isArray(res.body.products);
      assert.equal(res.body.products.length, 1);
      assert.equal(res.body.products[0].title, 'Elizabeth Gilbert: A Biography');
      assert.equal(res.body.total, 1);
    });

    it('should return all products that match the keyword', async () => {
      const res = await server.get('/products?page=1&size=10&keyword=memoir');

      assert.equal(res.status, 200);
      assert.isArray(res.body.products);
      assert.equal(res.body.products.length, 1);
      assert.equal(res.body.products[0].title, 'Elizabeth Gilbert: A Biography');
      assert.equal(res.body.total, 1);
    });
  });

  describe('GET /products/:id', () => {
    it('should return error if invalid Id sent', async () => {
      const res = await server.get('/products/999');

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'id must be a UUID');
    });

    it('should return 404 if product not found', async () => {
      const res = await server.get(`/products/${faker.datatype.uuid()}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.message, 'Product not found');
    });

    it('should return a product', async () => {
      const res = await server.get(`/products/${product.id}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.id, product.id);
      assert.equal(res.body.title, product.title);
    });
  });
});
``
