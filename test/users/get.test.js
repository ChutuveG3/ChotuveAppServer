const { getResponse } = require('../utils/utils');
const { userDataFactory } = require('../factories/users');
const { mockValidateTokenOnce, mockFailValidateTokenOnce } = require('../mocks/authorization');
const { mockFailViewProfileOnce, mockViewProfileOnce } = require('../mocks/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');

const viewProfileUrl = username => `/users/${username}`;
const updateProfileBaseUrl = '/users/me';

const authHeader = {
  authorization: 'aToken'
};
describe('GET /users/:username to view profile', () => {
  describe('Missing params', () => {
    const username = 'testUN';
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'get', endpoint: viewProfileUrl(username) }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Invalid params', () => {
    const userData = userDataFactory();
    mockFailValidateTokenOnce();
    let invalidTokenResponse = {};
    beforeAll(async () => {
      invalidTokenResponse = await getResponse({
        method: 'get',
        endpoint: viewProfileUrl(userData.username),
        header: authHeader
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status code', () => {
      expect(invalidTokenResponse.status).toBe(502);
    });

    it('Check message', () => {
      expect(invalidTokenResponse.body.message.status).toBe(401);
      expect(invalidTokenResponse.body.message.error.internal_code).toBe('invalid_token_error');
    });

    it('Check internal code', () => {
      expect(invalidTokenResponse.body.internal_code).toBe('auth_server_error');
    });
  });

  describe('User does not exists', () => {
    const userData = userDataFactory();
    mockValidateTokenOnce();
    mockFailViewProfileOnce();
    let userNotFoundResponse = {};
    beforeAll(async () => {
      userNotFoundResponse = await getResponse({
        method: 'get',
        endpoint: viewProfileUrl(userData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    describe('Check response', () => {
      it('Check status code', () => {
        expect(userNotFoundResponse.status).toBe(502);
      });

      it('Check message', () => {
        expect(userNotFoundResponse.body.message.error.internal_code).toBe('user_not_exists');
        expect(userNotFoundResponse.body.message.status).toBe(409);
      });

      it('Check internal code', () => {
        expect(userNotFoundResponse.body.internal_code).toBe('auth_server_error');
      });
    });
  });

  describe('Get profile correctly', () => {
    const userData = userDataFactory();
    const correctBodyResponse = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_name: userData.username,
      email: userData.email,
      birthdate: userData.birthdate,
      profile_img_url: userData.profileImgUrl
    };
    mockValidateTokenOnce();
    mockViewProfileOnce({ ...userData });
    let profileResponse = {};
    beforeAll(async () => {
      profileResponse = await getResponse({
        method: 'get',
        endpoint: viewProfileUrl(userData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(profileResponse.status).toBe(200);
    });

    it('Check body', () => {
      expect(profileResponse.body).toStrictEqual(correctBodyResponse);
    });
  });
});

describe('PUT /users/me to update profile', () => {
  const updatedUserData = {
    first_name: 'MyNewFirstName',
    last_name: 'MyNewLastName',
    email: 'newEmail@test.com',
    birthdate: '1995-07-22'
  };
  describe('Missing or invalid params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: updatedUserData
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if first name is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.first_name;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: currentUpdateUserData,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('first_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if last name is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.last_name;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: currentUpdateUserData,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('last_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if email is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.email;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: currentUpdateUserData,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if birthdate is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.birthdate;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: currentUpdateUserData,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if all the body is missing', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(4);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: { ...updatedUserData, email: 'notanemail.com' },
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl,
        body: { ...updatedUserData, birthdate: '4/6/95' },
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
