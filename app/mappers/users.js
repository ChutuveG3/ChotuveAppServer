exports.updateUserMapper = params => ({
  srcUsername: params.src_username
});

exports.userFriendshipMapper = params => ({
  srcUsername: params.src_username,
  dstUsername: params.dst_username
});
