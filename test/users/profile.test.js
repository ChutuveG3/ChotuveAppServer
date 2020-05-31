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
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
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
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if first name is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.first_name;
      return getResponse({
        method: 'put',
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
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
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
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
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
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
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
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
        endpoint: `${updateProfileBaseUrl}/${testUsername}`,
        header: authHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(4);
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
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
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
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
