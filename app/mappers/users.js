exports.updateUserMapper = params => ({
  srcUsername: params.src_username
});

exports.userFriendshipMapper = params => ({
  srcUsername: params.src_username,
  dstUsername: params.dst_username
});

exports.userLoginMapper = (body, headers) => ({
  username: body.username,
  firebaseToken: headers.firebase_token
});

exports.logOutUserMapper = params => ({ username: params.src_username });
exports.userTokenMapper = user => ({
  tokenUsername: user.user_name
});

exports.userParamMapper = params => ({
  pathUsername: params.username
});
