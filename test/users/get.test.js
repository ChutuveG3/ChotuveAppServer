const { getResponse } = require('../utils/utils');
const { userDataFactory } = require('../factories/users');
const { mockValidateTokenOnce, mockFailValidateTokenOnce } = require('../mocks/authorization');
const { mockFailViewProfileOnce, mockViewProfileOnce } = require('../mocks/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');

const viewProfileUrl = username => `/users/${username}`;

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
