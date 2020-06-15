exports.updateUserMapper = params => ({
  srcUsername: params.src_username
});

exports.userFriendshipMapper = params => ({
  srcUsername: params.src_username,
  dstUsername: params.dst_username
});

exports.userLoginMapper = body => ({ username: body.username, firebaseToken: body.firebase_token });

exports.logOutUserMapper = params => ({ username: params.src_username });
