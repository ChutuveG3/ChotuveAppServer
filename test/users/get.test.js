const { getResponse, truncateUserCollection } = require('../utils/utils');
const {
  userDataFactory,
  createUserFactory,
  friendRequestFactory,
  friendFactory
} = require('../factories/users');
const {
  mockValidateTokenOnce,
  mockFailValidateTokenOnce,
  mockValidateTokenAndLoadUser
} = require('../mocks/authorization');
const { mockFailViewProfileOnce, mockViewProfileOnce } = require('../mocks/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');

const viewProfileUrl = username => `/users/${username}`;
const listFriendRequestsBaseUrl = username => `/users/${username}/friends/pending`;
const listFriendsBaseUrl = username => `/users/${username}/friends`;

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
      expect(invalidTokenResponse.status).toBe(401);
    });

    it('Check message', () => {
      expect(invalidTokenResponse.body.message.internal_code).toBe('invalid_token_error');
    });

    it('Check internal code', () => {
      expect(invalidTokenResponse.body.internal_code).toBe('invalid_token_error');
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
        expect(userNotFoundResponse.status).toBe(409);
      });

      it('Check message', () => {
        expect(userNotFoundResponse.body.message.internal_code).toBe('user_not_exists');
      });

      it('Check internal code', () => {
        expect(userNotFoundResponse.body.internal_code).toBe('user_not_exists');
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

describe('GET /users/:src_username/friends/pending', () => {
  const srcUserData = userDataFactory();
  let emptyListResponse = {};
  let twoFriendsRequestResponse = {};
  beforeAll(async () => {
    await truncateUserCollection();
    await createUserFactory(srcUserData.username);
    mockValidateTokenAndLoadUser(srcUserData);
    emptyListResponse = await getResponse({
      method: 'get',
      endpoint: listFriendRequestsBaseUrl(srcUserData.username),
      header: { authorization: TOKEN_FOR_AUTH }
    });

    await friendRequestFactory({ srcUsername: srcUserData.username, dstUsername: 'un1' });
    await friendRequestFactory({ srcUsername: srcUserData.username, dstUsername: 'un2' });
    mockValidateTokenAndLoadUser(srcUserData);
    twoFriendsRequestResponse = await getResponse({
      method: 'get',
      endpoint: listFriendRequestsBaseUrl(srcUserData.username),
      header: { authorization: TOKEN_FOR_AUTH }
    });
  });

  describe('Missing params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'get', endpoint: listFriendRequestsBaseUrl('un') }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Empty friends request list', () => {
    it('Check status', () => {
      expect(emptyListResponse.status).toBe(200);
    });

    it('Check list length', () => {
      expect(emptyListResponse.body.friend_requests.length).toBe(0);
    });
  });

  describe('Two friends request list', () => {
    it('Check status', () => {
      expect(twoFriendsRequestResponse.status).toBe(200);
    });

    it('Check list length', () => {
      expect(twoFriendsRequestResponse.body.friend_requests.length).toBe(2);
    });
  });
});

describe('GET /users/:username/friends', () => {
  const srcUserData = userDataFactory();
  let emptyListResponse = {};
  let twoFriendsResponse = {};
  beforeAll(async () => {
    await truncateUserCollection();
    await createUserFactory(srcUserData.username);
    mockValidateTokenAndLoadUser(srcUserData);
    emptyListResponse = await getResponse({
      method: 'get',
      endpoint: listFriendsBaseUrl(srcUserData.username),
      header: { authorization: TOKEN_FOR_AUTH }
    });

    await friendFactory({ srcUsername: srcUserData.username, dstUsername: 'un1' });
    await friendFactory({ srcUsername: srcUserData.username, dstUsername: 'un2' });
    mockValidateTokenAndLoadUser(srcUserData);
    twoFriendsResponse = await getResponse({
      method: 'get',
      endpoint: listFriendsBaseUrl(srcUserData.username),
      header: { authorization: TOKEN_FOR_AUTH }
    });
  });

  describe('Missing params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'get', endpoint: listFriendsBaseUrl('un') }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Empty friends list', () => {
    it('Check status', () => {
      expect(emptyListResponse.status).toBe(200);
    });

    it('Check list length', () => {
      expect(emptyListResponse.body.friends.length).toBe(0);
    });
  });

  describe('Two friends list', () => {
    it('Check status', () => {
      expect(twoFriendsResponse.status).toBe(200);
    });

    it('Check list length', () => {
      expect(twoFriendsResponse.body.friends.length).toBe(2);
    });
  });
});
