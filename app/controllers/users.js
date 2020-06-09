const {
  signUpUser,
  createUser,
  loginUser,
  viewUserProfile,
  updateUserProfile,
  sendFriendRequest,
  listFriendRequests
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

exports.sendFriendRequest = ({ params: { username: srcUser, username2: dstUser } }, res, next) =>
  sendFriendRequest(srcUser, dstUser)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.listFriendRequests = ({ params: { username }, query: { offset, limit } }, res, next) =>
  listFriendRequests(username, offset, limit)
    .then(friendRequests => res.status(200).send({ friendRequests }))
    .catch(next);
