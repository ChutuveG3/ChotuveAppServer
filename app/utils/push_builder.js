exports.sendFriendRequestPushBuilder = ({ srcUsername, dstUserFirebaseToken }) => ({
  title: 'Nueva solicitud de amistad.',
  body: `${srcUsername} te envió una solicitud de amistad`,
  firebaseToken: dstUserFirebaseToken
});

exports.acceptFriendRequestPushBuilder = ({ srcUsername, dstUserFirebaseToken }) => ({
  title: 'Tenés un nuevo amigo.',
  body: `${srcUsername} aceptó tu solicitud de amistad`,
  firebaseToken: dstUserFirebaseToken
});

exports.newVideoPushBuilder = ({ username, friendFirebaseToken }) => ({
  title: 'Hay un nuevo video esperándote.',
  body: `${username} subió un nuevo video. No te lo pierdas! `,
  firebaseToken: friendFirebaseToken
});
