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
