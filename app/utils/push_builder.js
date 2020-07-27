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

exports.deleteVideoPushBuilder = ({ ownerFirebaseToken }) => ({
  title: 'Video deleted',
  body: 'One of your videos has been taken down.',
  firebaseToken: ownerFirebaseToken
});

exports.newMessagePushBuilder = ({ srcUsername, message, receiverFirebaseToken }) => ({
  title: `New message from ${srcUsername}`,
  body: message,
  firebaseToken: receiverFirebaseToken
});
