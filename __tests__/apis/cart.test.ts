import { assert } from 'chai';
import supertest from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import { productService } from '../../src/services';

const server = supertest.agent(app);

describe('Cart Router', function () {
  let token: string;
  let token2: string;
  let products: any;
  let cartId: string;
  let cartId2: string;

  before(async function beforeHook() {
    const res = await server
      .post('/signup')
      .send({ email: faker.internet.email(), password: faker.random.alphaNumeric(9) });

    assert.equal(res.status, 201);
    assert.exists(res.body.token);
    token = res.body.token;
    const res1 = await server
      .post('/signup')
      .send({ email: faker.internet.email(), password: faker.random.alphaNumeric(9) });

    assert.equal(res1.status, 201);
    assert.exists(res1.body.token);
    token2 = res1.body.token;

    ({ products } = await productService.getProducts({} as any));
  });

  describe('POST /carts(/:id)?/product', () => {
    it('should not add product to cart if no token provided', async () => {
      const res = await server.post('/carts/product').send({ productId: products[0].id, quantity: 1 });

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'No token Provided');
    });

    it('should not add product to cart if invalid token provided', async () => {
      const res = await server
        .post('/carts/product')
        .send({ productId: products[0].id, quantity: 1 })
        .set('Authorization', 'invalid-token');

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'Invalid token supplied');
    });

    it('should not add product to cart if no product id provided', async () => {
      const res = await server.post('/carts/product').set('Authorization', `Bearer ${token}`).send({ quantity: 1 });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'productId is a required field');
    });

    it('should not add product to cart if invalid product id provided', async () => {
      const res = await server
        .post('/carts/product')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 'invalid-id', quantity: 1 });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'productId must be a UUID');
    });

    it('should not add product to cart if quantity is not provided', async () => {
      const res = await server
        .post('/carts/product')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: products[0].id });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'quantity is a required field');
    });

    it('should not add product to cart if cart id provided but invalid', async () => {
      const res = await server
        .post(`/carts/${faker.datatype.uuid()}/product`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: products[0].id, quantity: 1 });

      assert.equal(res.status, 404);
      assert.equal(res.body.message, 'Cart not found');
    });

    it('should add product to cart without cart Id', async () => {
      const res = await server
        .post('/carts/product')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: products[0].id, quantity: 1 });

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 1);
      assert.equal(res.body.items[0].product.id, products[0].id);
      assert.equal(res.body.items[0].quantity, 1);
      assert.equal(res.body.total, products[0].price);
      cartId = res.body.id;
    });

    it('should add product to cart with cart Id', async () => {
      const res = await server
        .post(`/carts/${cartId}/product`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: products[1].id, quantity: 2 });

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 2);
      assert.equal(res.body.items[1].product.id, products[1].id);
      assert.equal(res.body.items[1].quantity, 2);
      assert.equal(res.body.total, products[0].price + products[1].price * 2);
    });

    it('should add product to already existing cart', async () => {
      const res = await server
        .post(`/carts/product`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: products[2].id, quantity: 3 });

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 3);
      assert.equal(res.body.items[2].product.id, products[2].id);
      assert.equal(res.body.items[2].quantity, 3);
      assert.equal(res.body.total, products[0].price + products[1].price * 2 + products[2].price * 3);
    });

    it('should add same product to cart without cart Id for another user', async () => {
      const res = await server
        .post('/carts/product')
        .set('Authorization', `Bearer ${token2}`)
        .send({ productId: products[0].id, quantity: 1 });

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 1);
      assert.equal(res.body.items[0].product.id, products[0].id);
      assert.equal(res.body.items[0].quantity, 1);
      assert.equal(res.body.total, products[0].price);
      cartId2 = res.body.id;
    });
  });

  describe('GET /carts(/:id)?', () => {
    it('should not get cart if no token provided', async () => {
      const res = await server.get('/carts');

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'No token Provided');
    });

    it('should not get cart if invalid token provided', async () => {
      const res = await server.get('/carts').set('Authorization', 'invalid-token');

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'Invalid token supplied');
    });

    it('should get cart without cart Id', async () => {
      const res = await server.get('/carts').set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 3);
      assert.equal(res.body.items[0].product.id, products[0].id);
      assert.equal(res.body.items[0].quantity, 1);
    });

    it('should get cart with cart Id', async () => {
      const res = await server.get(`/carts/${cartId}`).set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 3);
      assert.equal(res.body.items[0].product.id, products[0].id);
      assert.equal(res.body.items[0].quantity, 1);
    });
  });

  describe('DELETE /carts/:id/item/:itemId', () => {
    let items: any;
    let items1: any;
    before(async () => {
      const res = await server.get(`/carts/${cartId}`).set('Authorization', `Bearer ${token}`);
      items = res.body.items;
      const res1 = await server.get(`/carts/${cartId2}`).set('Authorization', `Bearer ${token}`);
      items1 = res1.body.items;
    });
    it('should not delete item from cart if no token provided', async () => {
      const res = await server.delete(`/carts/${cartId}/item/${faker.datatype.uuid()}`);

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'No token Provided');
    });

    it('should not delete item from cart if invalid token provided', async () => {
      const res = await server
        .delete(`/carts/${cartId}/item/${faker.datatype.uuid()}`)
        .set('Authorization', 'invalid-token');

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'Invalid token supplied');
    });

    it('should not delete item from cart if invalid item id provided', async () => {
      const res = await server
        .delete(`/carts/${cartId}/item/${faker.datatype.uuid()}`)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.message, 'CartItem not found');
    });

    it('should delete item from cart', async () => {
      const res = await server.delete(`/carts/${cartId}/item/${items[0].id}`).set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 2);
      assert.equal(res.body.items[0].product.id, products[1].id);
      assert.equal(res.body.items[0].quantity, 2);
      assert.equal(res.body.total, products[1].price * 2 + products[2].price * 3);
    });

    it('should not delete item from cart with cart Id for another user', async () => {
      const res = await server.delete(`/carts/${cartId2}/item/${items[1].id}`).set('Authorization', `Bearer ${token2}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.message, 'CartItem not found');
    });

    it('should delete item from cart with cart Id', async () => {
      const res = await server
        .delete(`/carts/${cartId2}/item/${items1[0].id}`)
        .set('Authorization', `Bearer ${token2}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.items);
      assert.equal(res.body.items.length, 0);
    });
  });

  describe('POST /carts/:id/checkout', () => {
    it('should not checkout cart if no token provided', async () => {
      const res = await server.post(`/carts/${cartId}/checkout`);

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'No token Provided');
    });

    it('should not checkout cart if invalid token provided', async () => {
      const res = await server.post(`/carts/${cartId}/checkout`).set('Authorization', 'invalid-token');

      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'Invalid token supplied');
    });

    it('should not checkout if no address provided', async () => {
      const res = await server.post(`/carts/${cartId}/checkout`).set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'address is a required field');
    });

    it('should not checkout if no paymentId provided', async () => {
      const res = await server
        .post(`/carts/${cartId}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          address: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'paymentId is a required field');
    });

    it('should not checkout if incomplete address provided', async () => {
      const res = await server
        .post(`/carts/${cartId}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          address: {
            street: faker.address.streetName(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
          paymentId: faker.datatype.uuid(),
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'city is a required field');
    });

    it('should not checkout cart if cart is empty', async () => {
      const res = await server
        .post(`/carts/${cartId2}/checkout`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          address: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
          paymentId: faker.datatype.uuid(),
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'Cart is empty');
    });

    it('should not checkout cart if cart does not belong to user', async () => {
      const res = await server
        .post(`/carts/${cartId}/checkout`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          address: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
          paymentId: faker.datatype.uuid(),
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'Cart does not belong to user');
    });

    it('should checkout cart', async () => {
      const res = await server
        .post(`/carts/${cartId}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          address: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
          paymentId: faker.datatype.uuid(),
        });

      assert.equal(res.status, 200);

      const res1 = await server.get(`/products/${products[1].id}`);
      const res2 = await server.get(`/products/${products[2].id}`);
      assert.equal(res1.body.quantity, products[1].quantity - 2);
      assert.equal(res2.body.quantity, products[2].quantity - 3);
    });

    it('should not checkout cart if cart is completed', async () => {
      const res = await server
        .post(`/carts/${cartId}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          address: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
          },
          paymentId: faker.datatype.uuid(),
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'Cart is not open');
    });
  });
});
