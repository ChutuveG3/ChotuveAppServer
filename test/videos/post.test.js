/* eslint-disable max-lines */
const { getResponse, truncateUserCollection, truncateVideoCollection } = require('../utils/utils');
const { mockValidateTokenAndLoadUser } = require('../mocks/authorization');
const { mockNotifyUser } = require('../mocks/push_notifications');
const { mockUploadVideo, mockFailUploadVideo } = require('../mocks/videos');
const { createUserFactory, userDataFactory } = require('../factories/users');
const { createVideoFactory } = require('../factories/videos');
const { TOKEN_FOR_AUTH } = require('../utils/constants');
const Videos = require('../../app/models/video');

const uploadVideoBaseUrl = '/videos';
const postCommentBaseUrl = id => `/videos/${id}/comments`;

const uploadVideoData = {
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  download_url: 'https://someUrl.com',
  datetime: '2020-05-18T18:43:35',
  visibility: 'private',
  file_name: 'video.mp4',
  file_size: '24335',
  latitude: 50,
  longitude: 50
};

describe('POST /videos upload', () => {
  const videoHeader = {
    authorization: 'aToken'
  };
  describe('Missing parameters', () => {
    it('Should be 400 if header is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if download url is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      delete currentVideoData.download_url;
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if datetime is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      delete currentVideoData.datetime;
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('datetime');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if visibility is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      delete currentVideoData.visibility;
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('visibility');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if file_name is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      delete currentVideoData.file_name;
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('file_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if file_size is missing', () => {
      const currentVideoData = { ...uploadVideoData };
      delete currentVideoData.file_size;
      return getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('file_size');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if download url is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, download_url: 'notAnURL' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('download_url');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if visibility is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, visibility: 'notVisible' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('visibility');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if datetime is invalid I', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, datetime: 'notADate4632' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('datetime');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if datetime is invalid II', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, datetime: '2/4/2020' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('datetime');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if datetime is invalid III', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, datetime: '2020-05-18T14:43:35.0453Z' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('datetime');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if longitude is not numeric', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, longitude: 'longitude' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('longitude');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if latitude is not numeric', () =>
      getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: { ...uploadVideoData, latitude: 'latitude' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('latitude');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Upload video correctly', () => {
    const userData = userDataFactory();
    let createVideoResponse = {};
    const videoId = 1;
    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);

      mockValidateTokenAndLoadUser(userData);
      mockUploadVideo(videoId);
      mockNotifyUser();
      createVideoResponse = await getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: uploadVideoData,
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(createVideoResponse.status).toBe(201);
    });

    it('Check message', () => {
      expect(createVideoResponse.body).toStrictEqual({ message: 'ok' });
    });

    it('Check that the video is created', () =>
      Videos.findOne({ id: 1 }).then(video => {
        expect(video.title).toBe(uploadVideoData.title);
      }));
  });
  describe('Media server error', () => {
    const userData = userDataFactory();
    let mediaErrorResponse = {};
    const videoId = 1;
    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);

      mockValidateTokenAndLoadUser(userData);
      mockFailUploadVideo(videoId);
      mockNotifyUser();
      mediaErrorResponse = await getResponse({
        method: 'post',
        endpoint: uploadVideoBaseUrl,
        body: uploadVideoData,
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(mediaErrorResponse.status).toBe(502);
    });
    it('Check internal code', () => {
      expect(mediaErrorResponse.body.internal_code).toBe('media_server_error');
    });

    it('Check message', () => {
      expect(mediaErrorResponse.body.message.internal_code).toBe('upload_video_error');
    });
  });
});

describe('POST /videos/:id/comments to post a comment', () => {
  const videoData = { ...uploadVideoData, videoId: 1 };
  const postCommentBody = {
    datetime: '2020-07-10T10:32:53',
    comment: 'Nice vid!'
  };
  describe('Valid or invalid operations', () => {
    describe('Comment on public video', () => {
      let commentOnPublicRes = {};
      const userData = userDataFactory();
      const userData2 = userDataFactory();

      beforeAll(async () => {
        await truncateUserCollection();
        await truncateVideoCollection();
        await createUserFactory(userData.username);
        await createUserFactory(userData2.username);
        await createVideoFactory({ ...videoData, owner: userData.username, visibility: 'public' });
        mockValidateTokenAndLoadUser(userData2);
        commentOnPublicRes = await getResponse({
          method: 'post',
          endpoint: postCommentBaseUrl(videoData.videoId),
          body: postCommentBody,
          header: { authorization: TOKEN_FOR_AUTH }
        });
      });

      afterAll(() => jest.clearAllMocks());

      it('Check status', () => {
        expect(commentOnPublicRes.status).toBe(201);
      });

      it('Check the comment is created', () =>
        Videos.findOne({ id: videoData.videoId }).then(video => {
          expect(video.comments[0]).toHaveProperty('username', userData2.username);
          expect(video.comments[0]).toHaveProperty('datetime');
          expect(video.comments[0]).toHaveProperty('comment', postCommentBody.comment);
        }));
    });
  });
});
