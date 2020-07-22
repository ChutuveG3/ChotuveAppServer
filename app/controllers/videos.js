const {
  createVideo,
  uploadVideo,
  getMediaVideosFromIds,
  getVideos,
  makeFilter,
  deleteVideo,
  addLikeToVideo,
  addDislikeToVideo,
  removeLikeFromVideo,
  removeDislikeFromVideo,
  removeReaction,
  addReaction,
  postComment,
  getVideoFromId,
  filterHomeVideos
} = require('../services/videos');
const { getVideosSerializer, getVideoSerializer, getHomeVideosSerializer } = require('../serializers/videos');
const { getUserFromUsername } = require('../services/users');
const { notifyUser } = require('../services/push_notifications');
const { newVideoPushBuilder, deleteVideoPushBuilder } = require('../utils/push_builder');
const { userTokenMapper, userParamMapper, usernameMapper } = require('../mappers/users');
const { rankVideos } = require('../services/ranker');

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

const getVideoAndMediaById = (id, requesterUsername) => {
  let video = {};
  return getVideoFromId(id)
    .then(foundVideo => {
      video = foundVideo;
      return getMediaVideosFromIds([video.id]);
    })
    .then(mediaVideos =>
      // eslint-disable-next-line no-underscore-dangle
      getVideoSerializer({ video: { ...video._doc, ...mediaVideos[0] }, requesterUsername })
    );
};

exports.getUserVideos = ({ user, params, query: { offset, limit } }, res, next) =>
  makeFilter(userTokenMapper(user), userParamMapper(params))
    .then(filters => getVideosAndMedia(filters, { id: 'asc' }, { offset, limit }))
    .then(videos => res.status(200).send({ videos }))
    .catch(next);

exports.getHomeVideos = ({ user, query: { offset, limit } }, res, next) =>
  getVideos({}, {}, {})
    .then(videosFound => filterHomeVideos(videosFound, user.user_name))
    .then(filteredVideos =>
      getMediaVideosFromIds(filteredVideos.map(video => video.id)).then(mediaVideos =>
        filteredVideos.map(video => ({
          // eslint-disable-next-line no-underscore-dangle
          ...video,
          ...mediaVideos.find(mediaVideo => mediaVideo.id === video.id)
        }))
      )
    )
    .then(videosWithMedia => rankVideos(videosWithMedia))
    .then(rankedVideos => {
      res.status(200).send({ videos: getHomeVideosSerializer(rankedVideos.slice(offset, limit)) });
    })
    .catch(next);

exports.deleteVideo = ({ params: { id } }, res, next) =>
  deleteVideo(id)
    .then(ownerUsername => getUserFromUsername(ownerUsername))
    .then(owner => notifyUser(deleteVideoPushBuilder({ ownerFirebaseToken: owner.firebaseToken })))
    .then(() => res.status(200).end())
    .catch(next);

exports.likeVideo = ({ user, video }, res, next) =>
  addReaction({
    video,
    addingList: 'likes',
    removingList: 'dislikes',
    username: usernameMapper(user).username,
    addingFunction: addLikeToVideo,
    removingFunction: removeDislikeFromVideo
  })
    .then(() => res.status(200).send())
    .catch(next);

exports.dislikeVideo = ({ user, video }, res, next) =>
  addReaction({
    video,
    addingList: 'dislikes',
    removingList: 'likes',
    username: usernameMapper(user).username,
    addingFunction: addDislikeToVideo,
    removingFunction: removeLikeFromVideo
  })
    .then(() => res.status(200).send())
    .catch(next);

exports.unlikeVideo = ({ user, video }, res, next) =>
  removeReaction({
    video,
    reactionList: 'likes',
    username: usernameMapper(user).username,
    removingFunction: removeLikeFromVideo
  })
    .then(() => res.status(200).send())
    .catch(next);

exports.undislikeVideo = ({ user, video }, res, next) =>
  removeReaction({
    video,
    reactionList: 'dislikes',
    username: usernameMapper(user).username,
    removingFunction: removeDislikeFromVideo
  })
    .then(() => res.status(200).send())
    .catch(next);

exports.postComment = ({ user, video, body }, res, next) =>
  postComment(usernameMapper(user).username, body, video)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.getVideo = ({ video, user }, res, next) =>
  getVideoAndMediaById(video.id, user.user_name)
    .then(videoFound => res.status(200).send(videoFound))
    .catch(next);
