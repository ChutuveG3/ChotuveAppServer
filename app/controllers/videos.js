const { createVideo, uploadVideo, getMediaVideosFromIds, getVideos } = require('../services/videos');
const { getVideosSerializer } = require('../serializers/videos');

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

const getVideosAndMedia = (filters, order, { offset, limit }) => {
  let videos = {};
  return getVideos(filters, order, { offset, limit })
    .then(videosFound => {
      videos = videosFound;
      return getMediaVideosFromIds(videos.map(video => video.id));
    })
    .then(mediaVideos =>
      getVideosSerializer(
        videos.map(video => ({
          // eslint-disable-next-line no-underscore-dangle
          ...video._doc,
          ...mediaVideos.find(mediaVideo => mediaVideo.id === video.id)
        }))
      )
    );
};

exports.getOwnVideos = ({ user: { user_name: username }, query: { offset, limit } }, res, next) =>
  getVideosAndMedia({ owner: username }, { id: 'asc' }, { offset, limit })
    .then(videos => {
      res.status(200).send(videos);
    })
    .catch(next);

exports.getVideos = ({ query: { offset, limit } }, res, next) =>
  getVideosAndMedia({ visibility: 'public' }, { id: 'asc' }, { offset, limit })
    .then(videos => {
      res.status(200).send(videos);
    })
    .catch(next);
