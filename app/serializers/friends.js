exports.getFriendRequestsSerializer = friendRequests => ({ friend_requests: friendRequests });

exports.getFriendsSerializer = friends => ({ friends });

exports.getPotentialFriendsSerializer = usernames => ({
  potential_friends: usernames.map(username => username.username)
});
