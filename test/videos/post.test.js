const { getResponse, truncateUserCollection, truncateVideoCollection } = require('../utils/utils');
const { mockValidateTokenAndLoadUser } = require('../mocks/authorization');
const { mockNotifyUser } = require('../mocks/push_notifications');
const { mockUploadVideo, mockFailUploadVideo } = require('../mocks/videos');
const { createUserFactory, userDataFactory } = require('../factories/users');
const { TOKEN_FOR_AUTH } = require('../utils/constants');
const Videos = require('../../app/models/video');

const baseUrl = '/videos';

const videoHeader = {
  authorization: 'aToken'
};

const videoData = {
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  download_url: 'https://someUrl.com',
  datetime: '2020-05-18T18:43:35',
  visibility: 'private',
  file_name: 'video.mp4',
  file_size: '24335'
};

describe.only('POST /videos upload', () => {
  describe('Missing parameters', () => {
    it('Should be 400 if header is missing', () => {
      const currentVideoData = { ...videoData };
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: currentVideoData
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if download url is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.download_url;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: currentVideoData,
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if datetime is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.datetime;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
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
      const currentVideoData = { ...videoData };
      delete currentVideoData.visibility;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
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
      const currentVideoData = { ...videoData };
      delete currentVideoData.file_name;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
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
      const currentVideoData = { ...videoData };
      delete currentVideoData.file_size;
      return getResponse({
        method: 'post',
        endpoint: baseUrl,
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
        endpoint: baseUrl,
        body: { ...videoData, download_url: 'notAnURL' },
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
        endpoint: baseUrl,
        body: { ...videoData, visibility: 'notVisible' },
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
        endpoint: baseUrl,
        body: { ...videoData, datetime: 'notADate4632' },
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
        endpoint: baseUrl,
        body: { ...videoData, datetime: '2/4/2020' },
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
        endpoint: baseUrl,
        body: { ...videoData, datetime: '2020-05-18T14:43:35.0453Z' },
        header: videoHeader
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('datetime');
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
        endpoint: baseUrl,
        body: videoData,
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
        expect(video.title).toBe(videoData.title);
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
        endpoint: baseUrl,
        body: videoData,
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
