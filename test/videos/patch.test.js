/* eslint-disable max-lines */
const { getResponse, truncateUserCollection, truncateVideoCollection } = require('../utils/utils');
const { mockValidateTokenAndLoadUser } = require('../mocks/authorization');
// const { mockUploadVideo, mockFailUploadVideo } = require('../mocks/videos');
const { userDataFactory, createUserFactory, friendFactory } = require('../factories/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');
const { createVideoFactory } = require('../factories/videos');
const Videos = require('../../app/models/video');

const likeEndpoint = id => `/videos/${id}/like`;
const dislikeEndpoint = id => `/videos/${id}/dislike`;
const unlikeEndpoint = id => `/videos/${id}/unlike`;
const undislikeEndpoint = id => `/videos/${id}/undislike`;

const videoData = {
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  download_url: 'https://someUrl.com',
  datetime: '2020-05-18T18:43:35',
  visibility: 'private',
  file_name: 'video.mp4',
  file_size: '24335',
  latitude: 50,
  longitude: 50,
  videoId: 1
};

describe('PATCH /videos/:id/like', () => {
  describe('Like unexistent video', () => {
    let unexistentRes = {};
    const unexistentId = 2000;
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      mockValidateTokenAndLoadUser(userData);
      unexistentRes = await getResponse({
        endpoint: likeEndpoint(unexistentId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(unexistentRes.status).toBe(409);
    });

    it('Check internal code', () => {
      expect(unexistentRes.body.internal_code).toBe('video_not_exists');
    });

    it('Check message', () => {
      expect(unexistentRes.body.message).toBe(`Video with id ${unexistentId} does not exist`);
    });
  });

  describe('Like private video of another non-friend user', () => {
    let privateSuccesfulResponse = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await createVideoFactory({ ...videoData, owner: userData.username });
      mockValidateTokenAndLoadUser(userData2);
      privateSuccesfulResponse = await getResponse({
        endpoint: likeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(privateSuccesfulResponse.status).toBe(500);
    });

    it('Check internal_code', () => {
      expect(privateSuccesfulResponse.body.internal_code).toBe('video_unavailable');
    });

    it('Check message', () => {
      expect(privateSuccesfulResponse.body.message).toBe(
        `User ${userData2.username} does not have access to this video`
      );
    });
  });

  describe('like public video of a friend', () => {
    let publicFriendRes = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await friendFactory({ srcUsername: userData.username, dstUsername: userData2.username });
      await friendFactory({ srcUsername: userData2.username, dstUsername: userData.username });
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData2);
      publicFriendRes = await getResponse({
        endpoint: likeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());
    it('Check status', () => {
      expect(publicFriendRes.status).toBe(200);
    });

    it('Check the liked is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.likes).toContain(userData2.username);
      }));
  });

  describe('Like public video of a not-friend', () => {
    let publicNotFriendRes = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData2);
      publicNotFriendRes = await getResponse({
        endpoint: likeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(publicNotFriendRes.status).toBe(200);
    });

    it('Check the liked is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.likes).toContain(userData2.username);
      }));
  });

  describe('Like own video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: likeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the like is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.likes).toContain(userData.username);
      }));
  });

  describe('Like disliked video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({
        ...videoData,
        owner: userData.username,
        visibility: 'public',
        dislikes: [userData.username]
      });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: likeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the like is created and the dislike is removed', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.likes).toContain(userData.username);
        expect(video.dislikes).not.toContain(userData.username);
      }));
  });
});

describe('PATCH /videos/:id/dislike', () => {
  describe('Dislike unexistent video', () => {
    let unexistentRes = {};
    const unexistentId = 2000;
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      mockValidateTokenAndLoadUser(userData);
      unexistentRes = await getResponse({
        endpoint: dislikeEndpoint(unexistentId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(unexistentRes.status).toBe(409);
    });

    it('Check internal code', () => {
      expect(unexistentRes.body.internal_code).toBe('video_not_exists');
    });

    it('Check message', () => {
      expect(unexistentRes.body.message).toBe(`Video with id ${unexistentId} does not exist`);
    });
  });

  describe('Dislike private video of another non-friend user', () => {
    let privateSuccesfulResponse = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await createVideoFactory({ ...videoData, owner: userData.username });
      mockValidateTokenAndLoadUser(userData2);
      privateSuccesfulResponse = await getResponse({
        endpoint: dislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(privateSuccesfulResponse.status).toBe(500);
    });

    it('Check internal_code', () => {
      expect(privateSuccesfulResponse.body.internal_code).toBe('video_unavailable');
    });

    it('Check message', () => {
      expect(privateSuccesfulResponse.body.message).toBe(
        `User ${userData2.username} does not have access to this video`
      );
    });
  });

  describe('Dislike public video of a friend', () => {
    let publicFriendRes = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await friendFactory({ srcUsername: userData.username, dstUsername: userData2.username });
      await friendFactory({ srcUsername: userData2.username, dstUsername: userData.username });
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData2);
      publicFriendRes = await getResponse({
        endpoint: dislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(publicFriendRes.status).toBe(200);
    });

    it('Check the dislike is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.dislikes).toContain(userData2.username);
      }));
  });

  describe('Dislike public video of a not-friend', () => {
    let publicNotFriendRes = {};
    const userData = userDataFactory();
    const userData2 = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createUserFactory(userData2.username);
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData2);
      publicNotFriendRes = await getResponse({
        endpoint: dislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(publicNotFriendRes.status).toBe(200);
    });

    it('Check the dislike is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.dislikes).toContain(userData2.username);
      }));
  });

  describe('Dislike own video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: dislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the dislike is created', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.dislikes).toContain(userData.username);
      }));
  });

  describe('Dislike liked video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({
        ...videoData,
        owner: userData.username,
        visibility: 'public',
        likes: [userData.username]
      });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: dislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    afterAll(() => jest.clearAllMocks());

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the dislike is created and the like is removed', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.dislikes).toContain(userData.username);
        expect(video.likes).not.toContain(userData.username);
      }));
  });
});

describe('PATCH /videos/id/unlike', () => {
  describe('Unlike liked video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({
        ...videoData,
        owner: userData.username,
        visibility: 'public',
        likes: [userData.username]
      });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: unlikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the like is removed', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.likes).not.toContain(userData.username);
      }));

    afterAll(() => jest.clearAllMocks());
  });
});

describe('PATCH /videos/id/undislike', () => {
  describe('Undisliked disliked video', () => {
    let ownVideoRes = {};
    const userData = userDataFactory();

    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({
        ...videoData,
        owner: userData.username,
        visibility: 'public',
        dislikes: [userData.username]
      });
      mockValidateTokenAndLoadUser(userData);
      ownVideoRes = await getResponse({
        endpoint: undislikeEndpoint(videoData.videoId),
        method: 'patch',
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(ownVideoRes.status).toBe(200);
    });

    it('Check the like is removed', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video.dislikes).not.toContain(userData.username);
      }));
    afterAll(() => jest.clearAllMocks());
  });
});
