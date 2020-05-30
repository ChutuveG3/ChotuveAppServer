const {
  createVideo,
  uploadVideo,
  getVideosFromIds,
  getMediaVideosFromOwner,
  getMediaVideos
} = require('../services/videos');
const { getVideosFromUserSerializer } = require('../serializers/videos');

const mergeVideos = (videos, mediaVideos) => {
  let auxVideo = {};
  return mediaVideos.map(mediaVideo => {
    auxVideo = videos.find(video => video.id === mediaVideo.id);
    return {
      ...auxVideo,
      ...mediaVideo
    };
  });
};

const getLocalVideosFromMediaVideos = mediaVideos => {
  const mediaVideosIds = mediaVideos.map(mediaVideo => mediaVideo.id);
  return getVideosFromIds(mediaVideosIds, { visibility: 'public' });
};

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
      return getLocalVideosFromMediaVideos(mediaVideos);
    })
    .then(videos => mergeVideos(videos, mediaVideos))
    .then(getVideosFromUserSerializer)
    .catch(next);
};

exports.getVideos = ({ query: { offset, limit } }, res, next) => {
  let mediaVideos = {};
  return getMediaVideos({ offset, limit })
    .then(mediaVideosFound => {
      mediaVideos = mediaVideosFound;
      return getLocalVideosFromMediaVideos(mediaVideos);
    })
    .then(videos => mergeVideos(videos, mediaVideos))
    .then(getVideosFromUserSerializer)
    .catch(next);
};
