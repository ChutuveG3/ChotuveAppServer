const { getResponse, truncateUserCollection } = require('../utils/utils');
const { userDataFactory, createUserFactory } = require('../factories/users');
const { mockFailValidateTokenOnce, mockValidateTokenAndLoadUser } = require('../mocks/authorization');
const { mockUpdateProfileOnce } = require('../mocks/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');

const updateProfileBaseUrl = username => `/users/${username}`;

const authHeader = {
  authorization: 'aToken'
};

describe('PUT /users/:username to update profile', () => {
  const userData = userDataFactory();
  const updatedUserData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: userData.email,
    birthdate: userData.birthdate
  };
  describe('Missing or invalid params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(4);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl(userData.username),
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
        endpoint: updateProfileBaseUrl(userData.username),
        body: { ...updatedUserData, birthdate: '4/6/95' },
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be 400 if token is invalid', () => {
      mockFailValidateTokenOnce();
      return getResponse({
        method: 'get',
        endpoint: updateProfileBaseUrl(userData.username),
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(401);
        expect(res.body.message.internal_code).toBe('invalid_token_error');
        expect(res.body.internal_code).toBe('invalid_token_error');
      });
    });
  });

  describe('Update user correctly', () => {
    let updateUserCorrectlyResponse = {};
    beforeAll(async () => {
      await truncateUserCollection();
      await createUserFactory(userData.username);
      mockValidateTokenAndLoadUser(userData);
      mockUpdateProfileOnce();
      updateUserCorrectlyResponse = await getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl(userData.username),
        body: updatedUserData,
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(updateUserCorrectlyResponse.status).toBe(200);
    });
  });
});
