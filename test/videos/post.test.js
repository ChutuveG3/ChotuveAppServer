const { getResponse } = require('../setup');

const baseUrl = '/videos';

const videoData = {
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  download_url: 'someUrl.com',
  datetime: '2020-05-18T14:43:35Z',
  visibility: 'private',
  file_name: 'video.mp4',
  file_size: '2Mb'
};

describe('POST /videos upload', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if download url is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.download_url;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if datetime is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.datetime;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if visibility is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.visibility;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if file_name is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.file_name;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if file_size is missing', () => {
      const currentVideoData = { ...videoData };
      delete currentVideoData.file_size;
      return getResponse({ method: 'post', endpoint: baseUrl, body: currentVideoData }).then(res => {
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
        body: { ...videoData, download_url: 'notAURL' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if visibility is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...videoData, visibility: 'notVisible' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if datetime is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...videoData, datetime: 'notadate94' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
});
