const {
  signUpUser,
  createUser,
  loginUser,
  viewUserProfile,
  updateUserProfile,
  sendFriendRequest,
  listFriendRequests,
  listFriends,
  acceptFriendRequest,
  rejectFriendRequest
} = require('../services/users');
const { getFriendRequestsSerializer, getFriendsSerializer } = require('../serializers/friends');
const { updateUserMapper, userFriendshipMapper } = require('../mappers/users');

exports.signUp = ({ body }, res, next) =>
  signUpUser(body)
    .then(() => createUser(body))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.login = ({ body }, res, next) =>
  loginUser(body)
    .then(response => res.status(200).send({ token: response.data.token }))
    .catch(next);

exports.viewProfile = ({ params: { username }, headers: { authorization: token } }, res, next) =>
  viewUserProfile(username, token)
    .then(userProfile => res.status(200).send(userProfile))
    .catch(next);

exports.updateProfile = ({ headers: { authorization: token }, body, params }, res, next) =>
  updateUserProfile(token, body, updateUserMapper(params))
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);

exports.sendFriendRequest = ({ params }, res, next) =>
  sendFriendRequest(userFriendshipMapper(params))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.listFriendRequests = ({ params, query: { offset, limit } }, res, next) =>
  listFriendRequests(userFriendshipMapper(params), offset, limit)
    .then(friendRequests => res.status(200).send(getFriendRequestsSerializer(friendRequests)))
    .catch(next);

exports.listFriends = ({ params, query: { offset, limit } }, res, next) =>
  listFriends(userFriendshipMapper(params), offset, limit)
    .then(friends => res.status(200).send(getFriendsSerializer(friends)))
    .catch(next);

exports.acceptFriendRequest = ({ params }, res, next) =>
  acceptFriendRequest(userFriendshipMapper(params))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.rejectFriendRequest = ({ params }, res, next) =>
  rejectFriendRequest(userFriendshipMapper(params))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);
