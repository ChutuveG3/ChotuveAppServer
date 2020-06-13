const { getResponse } = require('../setup');

const sendFriendRequestBaseUrl = (user1, user2) => `/users/${user1}/friends/${user2}`;
const listFriendRequestsBaseUrl = user => `/users/${user}/friends/pending`;
const listFriendsBaseUrl = user => `/users/${user}/friends`;
const acceptFriendBaseUrl = (user1, user2) => `/users/${user1}/friends/${user2}/accept`;
const rejectFriendBaseUrl = (user1, user2) => `/users/${user1}/friends/${user2}/reject`;

describe('POST /users/:username/friends/:username to send friend request', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'post', endpoint: sendFriendRequestBaseUrl('un1', 'un2') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});
describe('GET /users/:username/friends/pending to list friend request', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'get', endpoint: listFriendRequestsBaseUrl('un') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});
describe('GET /users/:username/friends to list friends', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'get', endpoint: listFriendsBaseUrl('un') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});
describe('POST /users/:username/friends/:username/accept to accept friend request', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'post', endpoint: acceptFriendBaseUrl('un1', 'un2') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});
describe('POST /users/:username/friends/:username/reject to reject friend request', () => {
  it('Should be status 400 if auth token header is missing', () =>
    getResponse({ method: 'post', endpoint: rejectFriendBaseUrl('un1', 'un2') }).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.message.errors).toHaveLength(1);
      expect(res.body.message.errors[0].param).toBe('authorization');
      expect(res.body.internal_code).toBe('invalid_params');
    }));
});
