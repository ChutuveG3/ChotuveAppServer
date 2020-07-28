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
  rejectFriendRequest,
  saveDeviceFirebaseToken,
  getUserFromUsername,
  deleteFirebaseToken,
  getPotentialFriends,
  deleteUser,
  recoverPassword,
  configurePassword
} = require('../services/users');
const {
  getFriendRequestsSerializer,
  getFriendsSerializer,
  getPotentialFriendsSerializer
} = require('../serializers/friends');
const {
  updateUserMapper,
  userFriendshipMapper,
  userLoginMapper,
  logOutUserMapper,
  potentialFriendsMapper,
  sendMessageNotificationMapper
} = require('../mappers/users');
const { notifyUser } = require('../services/push_notifications');
const {
  sendFriendRequestPushBuilder,
  acceptFriendRequestPushBuilder,
  newMessagePushBuilder
} = require('../utils/push_builder');

exports.signUp = ({ body }, res, next) =>
  signUpUser(body)
    .then(() => createUser(body))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.login = ({ body }, res, next) =>
  loginUser(body)
    .then(userInfo =>
      saveDeviceFirebaseToken(userLoginMapper(userInfo, body)).then(() => res.status(200).send(userInfo))
    )
    .catch(next);

exports.viewProfile = ({ user, params: { username }, headers: { authorization: token } }, res, next) =>
  viewUserProfile(username, token)
    .then(dstUserProfile =>
      getUserFromUsername(dstUserProfile.user_name).then(dstUser => {
        if (dstUser.friendRequests.includes(user.user_name)) {
          dstUserProfile.friendship = 'pending';
        } else if (dstUser.friends.includes(user.user_name)) {
          dstUserProfile.friendship = 'yes';
        } else {
          dstUserProfile.friendship = 'no';
        }
        return res.status(200).send(dstUserProfile);
      })
    )
    .catch(next);

exports.updateProfile = ({ headers: { authorization: token }, body, params }, res, next) =>
  updateUserProfile(token, body, updateUserMapper(params))
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);

exports.sendFriendRequest = ({ params }, res, next) => {
  const { srcUsername, dstUsername } = userFriendshipMapper(params);
  return sendFriendRequest({ srcUsername, dstUsername })
    .then(() => getUserFromUsername(dstUsername))
    .then(dstUser => {
      notifyUser(sendFriendRequestPushBuilder({ srcUsername, dstUserFirebaseToken: dstUser.firebaseToken }));
      return res.status(201).send({ message: 'ok' });
    })
    .catch(next);
};

exports.listFriendRequests = ({ params, query: { offset, limit } }, res, next) =>
  listFriendRequests(userFriendshipMapper(params), offset, limit)
    .then(friendRequests => res.status(200).send(getFriendRequestsSerializer(friendRequests)))
    .catch(next);

exports.listFriends = ({ params, query: { offset, limit } }, res, next) =>
  listFriends(userFriendshipMapper(params), offset, limit)
    .then(friends => res.status(200).send(getFriendsSerializer(friends)))
    .catch(next);

exports.acceptFriendRequest = ({ params }, res, next) => {
  const { srcUsername, dstUsername } = userFriendshipMapper(params);
  return acceptFriendRequest({ srcUsername, dstUsername })
    .then(() => getUserFromUsername(dstUsername))
    .then(dstUser => {
      notifyUser(
        acceptFriendRequestPushBuilder({ srcUsername, dstUserFirebaseToken: dstUser.firebaseToken })
      );
      return res.status(201).send({ message: 'ok' });
    })
    .catch(next);
};

exports.rejectFriendRequest = ({ params }, res, next) =>
  rejectFriendRequest(userFriendshipMapper(params))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.logOut = ({ params }, res, next) =>
  deleteFirebaseToken({ ...logOutUserMapper(params) })
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);

exports.getPotentialFriends = ({ params, query }, res, next) =>
  getPotentialFriends(potentialFriendsMapper(params, query))
    .then(usernames => res.status(200).send(getPotentialFriendsSerializer(usernames)))
    .catch(next);

exports.deleteUser = ({ params: { username } }, res, next) =>
  deleteUser(username)
    .then(() => res.status(200).end())
    .catch(next);

exports.sendMessageNotification = (req, res, next) => {
  const { srcUsername, dstUsername, message } = sendMessageNotificationMapper(req);
  return getUserFromUsername(dstUsername)
    .then(dstUser =>
      notifyUser(
        newMessagePushBuilder({ srcUsername, message, receiverFirebaseToken: dstUser.firebaseToken })
      )
    )
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);
};

exports.recoverPassword = ({ body: { email } }, res, next) =>
  recoverPassword(email)
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);

exports.configurePassword = ({ body }, res, next) =>
  configurePassword(body)
    .then(() => res.status(200).send({ message: 'ok' }))
    .catch(next);
