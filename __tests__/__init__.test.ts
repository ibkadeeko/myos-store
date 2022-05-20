import { assert } from 'chai';
import supertest from 'supertest';

import app from '../src/app';
import connectionWrapper from '../src/connectionWrapper';

const server = supertest.agent(app)

const initTests = async () => {
  await new Promise((resolve: any) => {
    connectionWrapper(resolve);
  });
};

before(async function beforeHook() {
  await initTests();
})

describe('Server Setup', () => {
  describe('GET /health', () => {
    it('should return 200 response', async () => {
      const res = await server.get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.message, 'Health check');
    });
  });

  describe('Invalid Route', () => {
    it('should display 404 error', async () => {
      const res = await server.get('/invalid/route');
      assert.equal(res.status, 404);
    });
  });
})
