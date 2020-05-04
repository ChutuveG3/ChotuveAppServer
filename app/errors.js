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
exports.authServerError = (message, internalCode) =>
  internalError(message, internalCode || exports.AUTH_SERVER_ERROR);
