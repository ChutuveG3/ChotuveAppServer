const { createVideo, uploadVideo, getVideosFromIds, getMediaVideosFromOwner } = require('../services/videos');
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

exports.getVideosFromOwner = ({ params: { username }, query: { offset, limit } }, res, next) => {
  let mediaVideos = {};
  return getMediaVideosFromOwner(username, { offset, limit })
    .then(mediaVideosFound => {
      mediaVideos = mediaVideosFound;
      const mediaVideosIds = mediaVideos.map(mediaVideo => mediaVideo.id);
      return getVideosFromIds(mediaVideosIds, { visibility: 'public' });
    })
    .then(videos => {
      let auxVideo = {};
      return videos.map(video => {
        auxVideo = mediaVideos.find(mediaVideo => video.id === mediaVideo.id);
        return {
          ...auxVideo,
          ...video
        };
      });
    })
    .then(getVideosFromUserSerializer)
    .catch(next);
};
