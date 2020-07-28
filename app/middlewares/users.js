const moment = require('moment');
const { authorizationSchema } = require('./authorization');
const { invalidParams, userMismatchError, sameUserError } = require('../errors');
const { pagingSchema } = require('./paging');

exports.createUserSchema = {
  first_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'first_name should be a string'
  },
  last_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'last_name should be a string'
  },
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: true,
    errorMessage: 'password should be a string'
  },
  firebase_token: {
    in: ['body'],
    isJWT: true,
    optional: true,
    errorMessage: 'firebase_token should be a jwt'
  },
  user_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'userName should be a string'
  },
  birthdate: {
    in: ['body'],
    custom: {
      options: birthdate => moment(birthdate, 'YYYY-MM-DD', true).isValid() === true
    },
    optional: false,
    errorMessage: 'birthdate should be a valid date'
  }
};

exports.createUserLoginSchema = {
  username: {
    in: ['body'],
    isString: true,
    optional: true,
    errorMessage: 'username should be a string'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: true,
    errorMessage: 'password should be a string'
  },
  firebase_token: {
    in: ['body'],
    isJWT: true,
    optional: true,
    errorMessage: 'firebase_token should be a jwt'
  },
  device_firebase_token: {
    in: ['body'],
    isString: true,
    optional: true,
    errorMessage: 'device_firebase_token should be a string'
  }
};

exports.getCurrentUserSchema = {
  ...authorizationSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  }
};

exports.updateProfileSchema = {
  ...authorizationSchema,
  first_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'first_name should be a string'
  },
  last_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'last_name should be a string'
  },
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  },
  birthdate: {
    in: ['body'],
    custom: {
      options: birthdate => moment(birthdate, 'YYYY-MM-DD', true).isValid() === true
    },
    optional: false,
    errorMessage: 'birthdate should be a valid date'
  },
  profile_img_url: {
    in: ['body'],
    isString: true,
    optional: true,
    isURL: true,
    errorMessage: 'profile_image_url should be a string'
  }
};

const twoUsersSchema = {
  ...authorizationSchema,
  src_username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'src_username should be a string'
  },
  dst_username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'dst_username should be a string'
  }
};

exports.sendFriendRequestSchema = {
  ...twoUsersSchema
};

exports.validateUser = ({ user: { user_name }, params: { src_username } }, res, next) => {
  if (user_name !== src_username) return next(userMismatchError('Token user does not match route user'));
  return next();
};

const validateDifferentUsers = (username1, username2) => {
  if (username1 === username2) throw sameUserError(`Users must be different: ${username1}, ${username2}`);
};

exports.validateParamsUsers = ({ params: { src_username, dst_username } }, res, next) => {
  try {
    validateDifferentUsers(src_username, dst_username);
  } catch (err) {
    return next(err);
  }
  return next();
};

const listSchema = {
  ...authorizationSchema,
  ...pagingSchema,
  src_username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'src_username should be a string'
  }
};

exports.listFriendRequestsSchema = {
  ...listSchema
};

exports.listFriendsSchema = {
  ...listSchema
};

exports.acceptFriendRequestSchema = {
  ...twoUsersSchema
};

exports.rejectFriendRequestSchema = {
  ...twoUsersSchema
};

exports.logOutUserSchema = {
  ...authorizationSchema,
  src_username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'src_username should be a string'
  }
};

exports.potentialFriendsSchema = {
  ...authorizationSchema,
  src_username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'src_username should be a string'
  },
  username: {
    in: ['query'],
    isString: true,
    optional: true,
    errorMessage: 'username should be a string'
  }
};

exports.validateSignUpCredentials = ({ body: { password, firebase_token } }, res, next) => {
  if (!password === !firebase_token) {
    return next(invalidParams('Password or firebase token must be present'));
  }
  return next();
};

exports.validateLoginCredentials = ({ body: { username, password, firebase_token } }, res, next) => {
  if ((username || password || !firebase_token) && (!username || !password || firebase_token)) {
    return next(invalidParams('Username and password, or firebase token must be present'));
  }
  return next();
};

exports.deleteUserSchema = {
  ...authorizationSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  }
};

exports.sendMessageNotificationSchema = {
  ...authorizationSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  },
  message: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'message should be a string'
  }
};

exports.passwordRecoverySchema = {
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  }
};

exports.passwordConfigurationSchema = {
  recovery_token: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'recovery_token should be a string'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: false,
    errorMessage: 'password should be a string'
  }
};
