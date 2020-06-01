const { createVideo, uploadVideo, getVideosByOwner, getMediaVideosFromIds } = require('../services/videos');
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
  let videos = {};
  return getVideosByOwner(username, { offset, limit })
    .then(videosFound => {
      videos = videosFound;
      return getMediaVideosFromIds(videos.map(video => video.id));
    })
    .then(mediaVideos => {
      res.status(200).send(
        getVideosFromUserSerializer(
          videos.map(video => ({
            // eslint-disable-next-line no-underscore-dangle
            ...video._doc,
            ...mediaVideos.find(mediaVideo => mediaVideo.id === video.id)
          }))
        )
      );
    })
    .catch(next);
};
