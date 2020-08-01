exports.updateUserMapper = params => ({
  srcUsername: params.src_username
});

exports.userFriendshipMapper = params => ({
  srcUsername: params.src_username,
  dstUsername: params.dst_username
});

exports.userLoginMapper = (userInfo, body) => ({
  username: userInfo.username,
  firebaseToken: body.device_firebase_token
});

exports.logOutUserMapper = params => ({ username: params.src_username });

exports.potentialFriendsMapper = (params, query) => ({
  srcUsername: params.src_username,
  keyUsername: query.username
});

exports.userTokenMapper = user => ({
  tokenUsername: user.user_name
});

exports.userParamMapper = params => ({
  pathUsername: params.username
});

exports.usernameMapper = params => ({
  username: params.user_name
});

exports.sendMessageNotificationMapper = req => ({
  srcUsername: req.user.user_name,
  dstUsername: req.params.username,
  message: req.body.message
});
