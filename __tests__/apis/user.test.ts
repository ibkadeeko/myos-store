import { assert } from 'chai';
import supertest from 'supertest';
import faker from '@faker-js/faker';

import app from '../../src/app';

const server = supertest.agent(app);

describe('Auth Routes', () => {
  const validData = {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(9),
  };

  describe('POST /signup', () => {
    it('should not sign up user if no email provided', async () => {
      const res = await server.post('/signup').send({ password: faker.random.alphaNumeric(9) });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'email is a required field');
    });

    it('should not sign up user if no password provided', async () => {
      const res = await server.post('/signup').send({ email: faker.internet.email() });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'password is a required field');
    });

    it('should sign up user', async () => {
      const res = await server.post('/signup').send(validData);

      assert.equal(res.status, 201);
      assert.exists(res.body.token);
      assert.equal(res.body.user.email, validData.email.toLowerCase());
    });

    it('should not sign up user that already exists', async () => {
      const res = await server.post('/signup').send(validData);

      assert.equal(res.status, 409);
      assert.equal(res.body.message, 'User with this email already exists');
    });
  });

  describe('POST /login', () => {
    it('should not login user if no email provided', async () => {
      const res = await server.post('/login').send({ password: faker.random.alphaNumeric(9) });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'email is a required field');
    });

    it('should not login user if no password provided', async () => {
      const res = await server.post('/login').send({ email: faker.internet.email() });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'password is a required field');
    });

    it('should not login user if password is incorrect', async () => {
      const res = await server.post('/login').send({ email: validData.email, password: faker.random.alphaNumeric(9) });

      assert.equal(res.status, 400);
      assert.equal(res.body.message, 'Invalid Password');
    });

    it('should login user', async () => {
      const res = await server.post('/login').send(validData);

      assert.equal(res.status, 200);
      assert.exists(res.body.token);
      assert.equal(res.body.user.email, validData.email.toLowerCase());
    })
  });
});
