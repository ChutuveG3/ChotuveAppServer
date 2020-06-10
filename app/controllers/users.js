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

exports.signUp = ({ body }, res, next) =>
  signUpUser(body)
    .then(() => createUser(body))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.login = ({ body }, res, next) =>
  loginUser(body)
    .then(response => res.status(200).send({ token: response.data.token }))
    .catch(next);

exports.viewProfile = ({ headers: { authorization: token } }, res, next) =>
  viewUserProfile(token)
    .then(userProfile => res.status(200).send(userProfile))
    .catch(next);

exports.updateProfile = ({ headers: { authorization: token }, body }, res, next) =>
  updateUserProfile(token, body)
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);

exports.sendFriendRequest = (
  { params: { src_username: srcUsername, dst_username: dstUsername } },
  res,
  next
) =>
  sendFriendRequest(srcUsername, dstUsername)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.listFriendRequests = ({ params: { src_username }, query: { offset, limit } }, res, next) =>
  listFriendRequests(src_username, offset, limit)
    .then(friendRequests => res.status(200).send({ friendRequests }))
    .catch(next);

exports.listFriends = ({ params: { src_username }, query: { offset, limit } }, res, next) =>
  listFriends(src_username, offset, limit)
    .then(friends => res.status(200).send({ friends }))
    .catch(next);

exports.acceptFriendRequest = (
  { params: { src_username: srcUsername, dst_username: dstUsername } },
  res,
  next
) =>
  acceptFriendRequest(srcUsername, dstUsername)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.rejectFriendRequest = (
  { params: { src_username: srcUsername, dst_username: dstUsername } },
  res,
  next
) =>
  rejectFriendRequest(srcUsername, dstUsername)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);
