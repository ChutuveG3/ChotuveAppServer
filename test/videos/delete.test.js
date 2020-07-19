const { getResponse, truncateUserCollection, truncateVideoCollection } = require('../utils/utils');
const { mockValidateAdminTokenOnce } = require('../mocks/authorization');
const { mockNotifyUser } = require('../mocks/push_notifications');
const { createUserFactory, userDataFactory } = require('../factories/users');
const { createVideoFactory } = require('../factories/videos');
const { TOKEN_FOR_AUTH } = require('../utils/constants');
const Videos = require('../../app/models/video');

const deleteVideoBaseUrl = id => `/videos/${id}`;

const videoData = {
  videoId: 1,
  title: 'AVideoTitle',
  description: 'AVideoDescription',
  visibility: 'private',
  latitude: 50,
  longitude: 50
};

describe('DELETE /videos/:id', () => {
  describe('Delete video correctly', () => {
    const userData = userDataFactory();
    let deleteVideoResponse = {};
    beforeAll(async () => {
      await truncateUserCollection();
      await truncateVideoCollection();
      await createUserFactory(userData.username);
      await createVideoFactory({ ...videoData, username: userData.username });

      mockValidateAdminTokenOnce();
      mockNotifyUser();
      deleteVideoResponse = await getResponse({
        method: 'delete',
        endpoint: deleteVideoBaseUrl(videoData.videoId),
        header: { authorization: TOKEN_FOR_AUTH }
      });
    });

    it('Check status', () => {
      expect(deleteVideoResponse.status).toBe(200);
    });

    it('Check that the video is deleted', () =>
      Videos.findOne({ id: videoData.videoId }).then(video => {
        expect(video).toBe(null);
      }));
  });
});
