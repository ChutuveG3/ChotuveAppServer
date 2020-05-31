const { getResponse } = require('../setup');

const viewProfileBaseUrl = '/users/me';
const updateProfileBaseUrl = '/users';

const authHeader = {
  authorization: 'aToken'
};

describe('GET /users/me to view profile', () => {
  describe('Missing or invalid params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'get', endpoint: viewProfileBaseUrl }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});

describe('PUT /users/:username to update profile', () => {
  const testUsername = 'testUser';
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
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
        body: updatedUserData
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
        body: { ...updatedUserData, email: 'notanemail.com' },
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
        body: { ...updatedUserData, birthdate: '4/6/95' },
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
