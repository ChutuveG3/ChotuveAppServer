const { getResponse } = require('../setup');

const baseUrl = '/videos';

const videoHeader = {
  authorization: 'aToken'
};

const videoData = {
  username: 'AUser',
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  download_url: 'https://someUrl.com',
  datetime: '2020-05-18T18:43:35',
  visibility: 'private',
  file_name: 'video.mp4',
  file_size: '24335'
};

describe('POST /videos upload', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if username is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.username;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
        expect(res.status).toBe(400);
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
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
