const { getResponse } = require('../utils/utils');
const { userDataFactory } = require('../factories/users');
const { mockSignUpOnce, mockLoginOnce } = require('../mocks/users');
const User = require('../../app/models/user');
const { LOGIN_TOKEN } = require('../utils/constants');

const baseUrl = '/users';
const sessionsUrl = `${baseUrl}/sessions`;

describe('POST /users signup', () => {
  const userData = userDataFactory();
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

  describe('Success signup', () => {
    let signUpResponse = {};

    beforeAll(async () => {
      mockSignUpOnce();
      signUpResponse = await getResponse({ endpoint: baseUrl, body: userData, method: 'post' });
    });

    afterAll(() => jest.clearAllMocks());

    describe('Check response', () => {
      it('Check response status', () => {
        expect(signUpResponse.status).toBe(201);
      });

      it('Check response message', () => {
        expect(signUpResponse.body).toStrictEqual({ message: 'ok' });
      });
    });

    describe('Check created user data', () => {
      let user = {};
      beforeAll(async () => {
        user = await User.findOne({ username: userData.user_name }).lean();
      });
      it('Check that the created user has the correct username', () => {
        expect(user.username).toBe(userData.user_name);
      });

      it('Check user has friends empty list', () => {
        expect(user.friends).toStrictEqual([]);
      });

      it('Check user has friends request empty list', () => {
        expect(user.friendRequests).toStrictEqual([]);
      });
    });
  });
});

describe('POST /users/sessions', () => {
  const userData = userDataFactory();
  describe('Missing parameters', () => {
    it('Should be status 400 if username is missing', () => {
      const currentUserData = { username: userData.user_name, password: userData.password };
      delete currentUserData.username;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('username');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { username: userData.user_name, password: userData.password };
      delete currentUserData.password;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both username and password are missing', () =>
      getResponse({ method: 'post', endpoint: sessionsUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(3);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Invalid parameters', () => {
    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { username: userData.user_name, password: '1234' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('password');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if firebase_token is not a string', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { username: userData.user_name, password: userData.password, firebase_token: 4 }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('firebase_token');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Correct login', () => {
    let LoginResponse = {};

    beforeAll(async () => {
      mockLoginOnce();
      LoginResponse = await getResponse({
        endpoint: sessionsUrl,
        body: { username: userData.user_name, password: userData.password },
        method: 'post'
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check response status', () => {
      expect(LoginResponse.status).toBe(200);
    });

    it('Check token in response', () => {
      expect(LoginResponse.body.token).toBe(LOGIN_TOKEN);
    });
  });
});
