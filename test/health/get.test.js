const { getResponse } = require('../utils/utils');

describe('GET /health', () => {
  let healthResponse = {};
  beforeAll(async () => {
    healthResponse = await getResponse({ endpoint: '/health', method: 'get' });
  });

  test('Check response status', () => {
    expect(healthResponse.status).toBe(200);
  });

  test('Check uptime to be a positive number', () => {
    expect(healthResponse.body.uptime).toBeGreaterThan(0);
  });
});
