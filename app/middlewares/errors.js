const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.INVALID_PARAMS]: 400,
  [errors.AUTH_SERVER_ERROR]: 502,
  [errors.MEDIA_SERVER_ERROR]: 502,
  [errors.USER_NOT_EXISTS]: 409,
  [errors.INVALID_TOKEN_ERROR]: 401,
  [errors.USER_MISMATCH_ERROR]: 400,
  [errors.SAME_USER_ERROR]: 400,
  [errors.ALREADY_FRIENDS_ERROR]: 409
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
