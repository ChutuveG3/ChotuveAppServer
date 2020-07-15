/* eslint-disable max-lines */
const { getResponse, truncateUserCollection } = require('../utils/utils');
const {
  userDataFactory,
  createUserFactory,
  friendFactory,
  friendRequestFactory
} = require('../factories/users');
const { mockSignUpOnce, mockLoginOnce } = require('../mocks/users');
const { mockValidateTokenAndLoadUser } = require('../mocks/authorization');
const { mockNotifyUser } = require('../mocks/push_notifications');
const User = require('../../app/models/user');
const { LOGIN_TOKEN, TOKEN_FOR_AUTH, SIGNUP_TOKEN } = require('../utils/constants');

const baseUrl = '/users';
const sessionsUrl = `${baseUrl}/sessions`;
const sendFriendRequestBaseUrl = (user1, user2) => `${baseUrl}/${user1}/friends/${user2}`;
const acceptFriendBaseUrl = (user1, user2) => `${baseUrl}/${user1}/friends/${user2}/accept`;
const rejectFriendBaseUrl = (user1, user2) => `${baseUrl}/${user1}/friends/${user2}/reject`;

describe('POST /users signup', () => {
  const userData = userDataFactory();
  const requestData = {
    ...userData,
    first_name: userData.firstName,
    last_name: userData.lastName,
    user_name: userData.username
  };
  describe('Missing parameters', () => {
    it('Should be status 400 if first name is missing', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.first_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('first_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if last name is missing', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.last_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('last_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if email is missing', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.email;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if username is missing', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.user_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('user_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if birthdate is missing', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.birthdate;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
  });

  describe('Invalid parameters', () => {
    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...requestData, birthdate: 'invalid birthdate' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...requestData, email: 'invalidEmail' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if password length is not 6 at least', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...requestData, password: 'aaaaa' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('password');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if firebase token is not jwt', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.password;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...currentUserData, firebase_token: 'aaa' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('firebase_token');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if neither password or firebase token are present', () => {
      const currentUserData = { ...requestData };
      delete currentUserData.password;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...currentUserData }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if both password and firebase token are present', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...requestData, firebase_token: SIGNUP_TOKEN }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Success signup', () => {
    let signUpResponse = {};

    beforeAll(async () => {
      mockSignUpOnce();
      signUpResponse = await getResponse({ endpoint: baseUrl, body: requestData, method: 'post' });
    });

    afterAll(() => jest.clearAllMocks());

    describe('Check response', () => {
      it('Check response status', () => {
        expect(signUpResponse.status).toBe(201);
      });

      it('Check response message', () => {
        expect(signUpResponse.body).toHaveProperty('token');
      });
    });

    describe('Check created user data', () => {
      let user = {};
      beforeAll(async () => {
        user = await User.findOne({ username: userData.username }).lean();
      });
      it('Check that the created user has the correct username', () => {
        expect(user.username).toBe(userData.username);
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
  const loginUserData = { username: userData.username, password: userData.password };

  describe('Invalid parameters', () => {
    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...loginUserData, password: '1234' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('password');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if device_firebase_token is not a string', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...loginUserData, device_firebase_token: 4 }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('device_firebase_token');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if username, password and firebase_token are all present', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...loginUserData, firebase_token: SIGNUP_TOKEN }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('Correct login', () => {
    let loginResponse = {};

    beforeAll(async () => {
      mockLoginOnce();
      loginResponse = await getResponse({
        endpoint: sessionsUrl,
        body: { ...loginUserData },
        method: 'post'
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check response status', () => {
      expect(loginResponse.status).toBe(200);
    });

    it('Check token in response', () => {
      expect(loginResponse.body.token).toBe(LOGIN_TOKEN);
    });
  });
});

describe('POST users/:src_username/friends/:dst_username', () => {
  describe('Missing params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ method: 'post', endpoint: sendFriendRequestBaseUrl('un1', 'un2') }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });

  describe('invalid users', () => {
    const srcUserData = userDataFactory();
    const dstUsername = 'un2';
    let nonExistingDstResponse = {};
    let sameUserResponse = {};
    beforeAll(async () => {
      await truncateUserCollection();
      await createUserFactory(srcUserData.username);
      mockValidateTokenAndLoadUser(srcUserData);
      nonExistingDstResponse = await getResponse({
        method: 'post',
        endpoint: sendFriendRequestBaseUrl(srcUserData.username, dstUsername),
        header: { authorization: TOKEN_FOR_AUTH }
      });

      mockValidateTokenAndLoadUser(srcUserData);
      sameUserResponse = await getResponse({
        method: 'post',
        endpoint: sendFriendRequestBaseUrl(srcUserData.username, srcUserData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    describe('dst_user does not exist', () => {
      it('Check status', () => {
        expect(nonExistingDstResponse.status).toBe(409);
      });

      it('Check internal code', () => {
        expect(nonExistingDstResponse.body.internal_code).toBe('user_not_exists');
      });

      it('Check message', () => {
        expect(nonExistingDstResponse.body.message).toBe(`${dstUsername} does not exist`);
      });
    });

    describe('Same user', () => {
      it('Check status', () => {
        expect(sameUserResponse.status).toBe(400);
      });

      it('Check internal code', () => {
        expect(sameUserResponse.body.internal_code).toBe('same_user_error');
      });

      it('Check message', () => {
        expect(sameUserResponse.body.message).toBe(
          `Users must be different: ${srcUserData.username}, ${srcUserData.username}`
        );
      });
    });
  });

  describe('Correct friend request and duplicate friend request', () => {
    const srcUserData = userDataFactory();
    const dstUserData = userDataFactory();
    let correctFriendRequestResponse = {};
    let duplicateFriendRequestReponse = {};
    beforeAll(async () => {
      await truncateUserCollection();
      await createUserFactory(srcUserData.username);
      await createUserFactory(dstUserData.username);
      mockValidateTokenAndLoadUser(srcUserData);
      mockNotifyUser();
      correctFriendRequestResponse = await getResponse({
        method: 'post',
        endpoint: sendFriendRequestBaseUrl(srcUserData.username, dstUserData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });

      mockValidateTokenAndLoadUser(srcUserData);
      duplicateFriendRequestReponse = await getResponse({
        method: 'post',
        endpoint: sendFriendRequestBaseUrl(srcUserData.username, dstUserData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    describe('Correct friend request', () => {
      it('Check status', () => {
        expect(correctFriendRequestResponse.status).toBe(201);
      });

      it('Check that the friend request is sent', () =>
        User.findOne({ username: dstUserData.username }).then(user => {
          expect(user.friendRequests).toContain(srcUserData.username);
        }));
    });

    describe('Duplicate request', () => {
      it('Check status', () => {
        expect(duplicateFriendRequestReponse.status).toBe(201);
      });

      it('Check that the friend request is sent', () =>
        User.findOne({ username: dstUserData.username }).then(user => {
          expect(user.friendRequests).toContain(srcUserData.username);
        }));
    });
  });

  describe('Friend request to a friend', () => {
    const srcUserData = userDataFactory();
    const dstUserData = userDataFactory();
    let friendRequestToFriendResponse = {};

    beforeAll(async () => {
      await truncateUserCollection();
      await createUserFactory(srcUserData.username);
      await createUserFactory(dstUserData.username);
      await friendFactory({ srcUsername: srcUserData.username, dstUsername: dstUserData.username });
      mockValidateTokenAndLoadUser(srcUserData);
      friendRequestToFriendResponse = await getResponse({
        method: 'post',
        endpoint: sendFriendRequestBaseUrl(srcUserData.username, dstUserData.username),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(friendRequestToFriendResponse.status).toBe(409);
    });

    it('Check internal code', () => {
      expect(friendRequestToFriendResponse.body.internal_code).toBe('already_friends_error');
    });

    it('Check message', () => {
      expect(friendRequestToFriendResponse.body.message).toBe(
        `${srcUserData.username} and ${dstUserData.username} are already friends`
      );
    });
  });
});

describe.each([
  { endpoint: acceptFriendBaseUrl, action: 'accept' },
  { endpoint: rejectFriendBaseUrl, action: 'reject' }
])('Accept/Reject friend request', ({ endpoint, action }) => {
  describe(`POST users/:src_username/friends/:dst_username/${action}`, () => {
    describe('Missing params', () => {
      it('Should be status 400 if auth token header is missing', () =>
        getResponse({ method: 'post', endpoint: endpoint('un1', 'un2') }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('authorization');
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid users', () => {
      const srcUserData = userDataFactory();
      const dstUserData = userDataFactory();
      const unexistentDstUsername = 'un2';
      let withoutFriendRequestResponse = {};
      let alreadyFriendsResponse = {};
      let sameUserResponse = {};
      let nonExistingDstResponse = {};

      beforeAll(async () => {
        await truncateUserCollection();
        await createUserFactory(srcUserData.username);
        await createUserFactory(dstUserData.username);
        mockValidateTokenAndLoadUser(srcUserData);
        withoutFriendRequestResponse = await getResponse({
          method: 'post',
          endpoint: endpoint(srcUserData.username, dstUserData.username),
          header: { authorization: TOKEN_FOR_AUTH }
        });

        mockValidateTokenAndLoadUser(srcUserData);
        sameUserResponse = await getResponse({
          method: 'post',
          endpoint: endpoint(srcUserData.username, srcUserData.username),
          header: { authorization: TOKEN_FOR_AUTH }
        });

        await friendFactory({ srcUsername: dstUserData.username, dstUsername: srcUserData.username });
        await friendFactory({ srcUsername: srcUserData.username, dstUsername: dstUserData.username });
        await friendRequestFactory({ srcUsername: dstUserData.username, dstUsername: srcUserData.username });

        mockValidateTokenAndLoadUser(srcUserData);
        alreadyFriendsResponse = await getResponse({
          method: 'post',
          endpoint: endpoint(srcUserData.username, dstUserData.username),
          header: { authorization: TOKEN_FOR_AUTH }
        });

        mockValidateTokenAndLoadUser(srcUserData);
        nonExistingDstResponse = await getResponse({
          method: 'post',
          endpoint: sendFriendRequestBaseUrl(srcUserData.username, unexistentDstUsername),
          header: { authorization: TOKEN_FOR_AUTH }
        });
      });

      describe('Without friend request', () => {
        it('Check status', () => {
          expect(withoutFriendRequestResponse.status).toBe(409);
        });

        it('Check internal_code', () => {
          expect(withoutFriendRequestResponse.body.internal_code).toBe('missing_friend_request_error');
        });

        it('Check message', () => {
          expect(withoutFriendRequestResponse.body.message).toBe('Missing friend request');
        });
      });

      describe('Same user', () => {
        it('Check status', () => {
          expect(sameUserResponse.status).toBe(400);
        });

        it('Check internal code', () => {
          expect(sameUserResponse.body.internal_code).toBe('same_user_error');
        });

        it('Check message', () => {
          expect(sameUserResponse.body.message).toBe(
            `Users must be different: ${srcUserData.username}, ${srcUserData.username}`
          );
        });
      });

      describe(`${action} friend request from a friend`, () => {
        it('Check status', () => {
          expect(alreadyFriendsResponse.status).toBe(409);
        });
        it('Check internal code', () => {
          expect(alreadyFriendsResponse.body.internal_code).toBe('already_friends_error');
        });
        it('Check message', () => {
          expect(alreadyFriendsResponse.body.message).toBe(
            `${srcUserData.username} and ${dstUserData.username} are already friends`
          );
        });
      });

      describe('dst_user does not exist', () => {
        it('Check status', () => {
          expect(nonExistingDstResponse.status).toBe(409);
        });

        it('Check internal code', () => {
          expect(nonExistingDstResponse.body.internal_code).toBe('user_not_exists');
        });

        it('Check message', () => {
          expect(nonExistingDstResponse.body.message).toBe(`${unexistentDstUsername} does not exist`);
        });
      });
    });

    describe(`Correctly ${action} friend request`, () => {
      let correctResponse = {};
      const srcUserData = userDataFactory();
      const dstUserData = userDataFactory();
      beforeAll(async () => {
        await truncateUserCollection();
        await createUserFactory(srcUserData.username);
        await createUserFactory(dstUserData.username);
        mockValidateTokenAndLoadUser(srcUserData);
        mockNotifyUser();
        await friendRequestFactory({ srcUsername: dstUserData.username, dstUsername: srcUserData.username });
        correctResponse = await getResponse({
          method: 'post',
          endpoint: endpoint(srcUserData.username, dstUserData.username),
          header: { authorization: TOKEN_FOR_AUTH }
        });
      });

      it('Check status', () => {
        expect(correctResponse.status).toBe(201);
      });

      it('Check srcUser friends and requests', () =>
        User.findOne({ username: srcUserData.username })
          .lean()
          .then(user => {
            if (action === 'accept') {
              expect(user.friends).toContain(dstUserData.username);
              expect(user.friendRequests).not.toContain(dstUserData.username);
            } else {
              expect(user.friends).not.toContain(dstUserData.username);
              expect(user.friendRequests).not.toContain(dstUserData.username);
            }
          }));

      it('Check dstUser friends and requests', () =>
        User.findOne({ username: dstUserData.username })
          .lean()
          .then(user => {
            if (action === 'accept') {
              expect(user.friends).toContain(srcUserData.username);
            } else {
              expect(user.friends).not.toContain(srcUserData.username);
            }
          }));
    });
  });
});
