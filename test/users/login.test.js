const { getResponse } = require('../setup');

const baseUrl = '/users/sessions';

const userData = {
  username: 'MyUN',
  password: 'MyPassword'
};

describe('POST /users/sessions login', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if username is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.username;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('username');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.password;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both username and password are missing', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(3);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, password: '1234' } }).then(
        res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('password');
          expect(res.body.internal_code).toBe('invalid_params');
        }
      ));
  });
});
