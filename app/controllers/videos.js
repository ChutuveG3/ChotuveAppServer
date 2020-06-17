const { createVideo, uploadVideo, getMediaVideosFromIds, getVideos } = require('../services/videos');
const { getVideosSerializer } = require('../serializers/videos');
const { getUserFromUsername } = require('../services/users');
const { notifyUser } = require('../services/push_notifications');
const { newVideoPushBuilder } = require('../utils/push_builder');

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

exports.getOwnVideos = ({ user: { user_name: username }, query: { offset, limit } }, res, next) =>
  getVideosAndMedia({ owner: username }, { id: 'asc' }, { offset, limit })
    .then(videos => res.status(200).send(videos))
    .catch(next);

exports.getVideos = ({ query: { offset, limit } }, res, next) =>
  getVideosAndMedia({ visibility: 'public' }, { id: 'asc' }, { offset, limit })
    .then(videos => res.status(200).send(videos))
    .catch(next);
