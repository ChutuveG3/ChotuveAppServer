const { getResponse } = require('../setup');

const viewProfilebaseUrl = '/users/me';

describe('GET /users/me to view profile', () => {
  describe('Missing authorization header', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'get', endpoint: viewProfilebaseUrl }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
