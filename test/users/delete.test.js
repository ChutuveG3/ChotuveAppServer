const { getResponse, truncateUserCollection } = require('../utils/utils');
const { mockValidateAdminTokenOnce } = require('../mocks/authorization');
const { createUserFactory, userDataFactory } = require('../factories/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');
const User = require('../../app/models/user');

const deleteUserBaseUrl = username => `/users/${username}`;

describe('DELETE /users/:username', () => {
  describe('Delete user correctly', () => {
    const userData = userDataFactory();
    let deleteUserResponse = {};
    beforeAll(async () => {
      await truncateUserCollection();
      await createUserFactory(userData.username);

      mockValidateAdminTokenOnce();
      deleteUserResponse = await getResponse({
        method: 'delete',
        endpoint: deleteUserBaseUrl(userData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(deleteUserResponse.status).toBe(200);
    });

    it('Check that the user is deleted', () =>
      User.findOne({ userName: userData.username }).then(user => {
        expect(user).toBe(null);
      }));
  });
});
