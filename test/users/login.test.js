const { getResponse } = require('../setup');

const baseUrl = '/users/sessions';

const userData = {
  email: 'test@test.com',
  password: 'MyPassword'
};

describe('POST /users/sessions login', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if email is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.email;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.password;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both email and password are missing', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, email: 'invalid email' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, password: '1234' } }).then(
        res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        }
      ));
  });
});
