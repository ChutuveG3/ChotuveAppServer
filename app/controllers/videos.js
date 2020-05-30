const {
  createVideo,
  uploadVideo,
  getVideosFromOwner,
  getMediaVideosFromOwner
} = require('../services/videos');
const { getVideosFromUserSerializer } = require('../serializers/videos');

exports.upload = ({ body }, res, next) =>
  uploadVideo(body)
    .then(id =>
      createVideo(body, id)
        .then(() => {
          res.status(201).send({ message: 'ok' });
        })
        .catch(err => next(err))
    )
    .catch(err => next(err));

exports.getVideosFromOwner = ({ params: { username }, query: { offset, limit } }, res, next) =>
  Promise.all([
    getVideosFromOwner(username, { visibility: 'public' }),
    getMediaVideosFromOwner({ username, offset, limit })
  ])
    .then(([videos, mediaVideos]) => {
      let auxVideo = {};
      const videosIds = videos.map(video => video.id);
      const publicMediaVideos = mediaVideos.filter(mediaVideo => videosIds.includes(mediaVideo.id));
      return publicMediaVideos.map(mediaVideo => {
        auxVideo = videos.find(video => video.id === mediaVideo.id);
        return {
          ...auxVideo,
          ...mediaVideo
        };
      });
    })
    .then(getVideosFromUserSerializer)
    .catch(next);
