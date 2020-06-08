const { getResponse } = require('../setup');

const friendRequestBaseUrl = (user1, user2) => `/users/${user1}/friends/${user2}`;

describe('POST /users/:username/friends/:username to send friend request', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'post', endpoint: friendRequestBaseUrl('un1', 'un2') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});