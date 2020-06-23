const {
  createVideo,
  uploadVideo,
  getMediaVideosFromIds,
  getVideos,
  makeFilter,
  deleteVideo
} = require('../services/videos');
const { getVideosSerializer } = require('../serializers/videos');
const { getUserFromUsername } = require('../services/users');
const { notifyUser } = require('../services/push_notifications');
const { newVideoPushBuilder, deleteVideoPushBuilder } = require('../utils/push_builder');
const { userTokenMapper, userParamMapper } = require('../mappers/users');

const notifyFriendsOnNewVideo = username =>
  getUserFromUsername(username)
    .then(user => Promise.all(user.friends.map(friendUsername => getUserFromUsername(friendUsername))))
    .then(friends => {
      friends.forEach(friend => {
        notifyUser(newVideoPushBuilder({ username, friendFirebaseToken: friend.firebaseToken }));
      });
    });

exports.upload = ({ user: { user_name }, body }, res, next) =>
  uploadVideo(user_name, body)
    .then(id => createVideo(user_name, body, id))
    .then(() => {
      notifyFriendsOnNewVideo(user_name);
      return res.status(201).send({ message: 'ok' });
    })
    .catch(next);

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

exports.getUserVideos = ({ user, params, query: { offset, limit } }, res, next) =>
  makeFilter(userTokenMapper(user), userParamMapper(params))
    .then(filters => getVideosAndMedia(filters, { id: 'asc' }, { offset, limit }))
    .then(videos => res.status(200).send(videos))
    .catch(next);

exports.getVideos = ({ query: { offset, limit } }, res, next) =>
  getVideosAndMedia({ visibility: 'public' }, { id: 'asc' }, { offset, limit })
    .then(videos => res.status(200).send(videos))
    .catch(next);

exports.deleteVideo = ({ params: { id } }, res, next) =>
  deleteVideo(id)
    .then(ownerUsername => getUserFromUsername(ownerUsername))
    .then(owner => notifyUser(deleteVideoPushBuilder({ ownerFirebaseToken: owner.firebaseToken })))
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);
