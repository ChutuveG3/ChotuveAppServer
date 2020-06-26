const { getResponse } = require('../setup');
const { userDataFactory } = require('../factories/users');
const { mockSignUpOnce } = require('../mocks/users');

const baseUrl = '/users';

const userData = userDataFactory();

describe('POST /users signup', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if first name is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.first_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('first_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if last name is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.last_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('last_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if email is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.email;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
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

    it('Should be status 400 if username is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.user_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('user_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if birthdate is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.birthdate;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if it is missing multiple parameters', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(7);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Invalid parameters', () => {
    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, birthdate: 'invalid birthdate' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if email is invalid', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, email: 'invalidEmail' } }).then(
        res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('email');
          expect(res.body.internal_code).toBe('invalid_params');
        }
      ));

    it('Should be status 400 if password length is not 6 at least', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, password: 'aaaaa' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('password');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe.only('Success signup', () => {
    let signUpResponse = {};

    beforeAll(async () => {
      mockSignUpOnce();
      signUpResponse = await getResponse({ endpoint: baseUrl, body: userData, method: 'post' });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check response status', () => {
      expect(signUpResponse.status).toBe(200);
    });
  });
});
