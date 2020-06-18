exports.sendFriendRequestPushBuilder = ({ srcUsername, dstUserFirebaseToken }) => ({
  title: 'New friend request!',
  body: `${srcUsername} has sent you a friend request.`,
  firebaseToken: dstUserFirebaseToken
});

exports.acceptFriendRequestPushBuilder = ({ srcUsername, dstUserFirebaseToken }) => ({
  title: 'You have a new friend!',
  body: `${srcUsername} has accepted your friend request.`,
  firebaseToken: dstUserFirebaseToken
});

exports.newVideoPushBuilder = ({ username, friendFirebaseToken }) => ({
  title: 'There is a new video waiting for you.',
  body: `${username} has uploaded a new video. Check it out! `,
  firebaseToken: friendFirebaseToken
});
