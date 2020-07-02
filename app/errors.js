const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_PARAMS = 'invalid_params';
exports.invalidParams = message => internalError(message, exports.INVALID_PARAMS);

exports.AUTH_SERVER_ERROR = 'auth_server_error';
exports.authServerError = message => internalError(message, exports.AUTH_SERVER_ERROR);

exports.MEDIA_SERVER_ERROR = 'media_server_error';
exports.mediaServerError = message => internalError(message, exports.MEDIA_SERVER_ERROR);

exports.USER_NOT_EXISTS = 'user_not_exists';
exports.userNotExists = message => internalError(message, exports.USER_NOT_EXISTS);

exports.INVALID_TOKEN_ERROR = 'invalid_token_error';
exports.invalidTokenError = message => internalError(message, exports.INVALID_TOKEN_ERROR);

exports.USER_MISMATCH_ERROR = 'user_mismatch_error';
exports.userMismatchError = message => internalError(message, exports.USER_MISMATCH_ERROR);

exports.SAME_USER_ERROR = 'same_user_error';
exports.sameUserError = message => internalError(message, exports.SAME_USER_ERROR);

exports.ALREADY_FRIENDS_ERROR = 'already_friends_error';
exports.alreadyFriendsError = message => internalError(message, exports.ALREADY_FRIENDS_ERROR);

exports.MISSING_FRIEND_REQUEST_ERROR = 'missing_friend_request_error';
exports.missingFriendRequestError = message => internalError(message, exports.MISSING_FRIEND_REQUEST_ERROR);

exports.NOTIFICATION_ERROR = 'notification_error';
exports.notificationError = message => internalError(message, exports.NOTIFICATION_ERROR);

exports.UNAUTHORIZED = 'unauthorized';
exports.unauthorized = message => internalError(message, exports.UNAUTHORIZED);

exports.VIDEO_NOT_EXISTS = 'video_not_exists';
exports.videoNotExists = message => internalError(message, exports.VIDEO_NOT_EXISTS);
