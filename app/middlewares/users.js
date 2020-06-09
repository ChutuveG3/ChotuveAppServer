const moment = require('moment');
const { authorizationSchema } = require('./authorization');
const { userMismatchError, sameUserError } = require('../errors');
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
    optional: false,
    errorMessage: 'password should be a string'
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
    optional: false,
    errorMessage: 'password should be a string'
  }
};

exports.getCurrentUserSchema = {
  ...authorizationSchema
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
  }
};

exports.sendFriendRequestSchema = {
  ...authorizationSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username1 should be a string'
  },
  username2: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username2 should be a string'
  }
};

exports.validateUser = ({ user: { user_name }, params: { username } }, res, next) => {
  if (user_name !== username) next(userMismatchError('Token user does not match route user'));
  return next();
};

exports.validateParamsUsers = ({ params: { username, username2 } }, res, next) => {
  try {
    exports.validateDifferentUsers(username, username2);
  } catch (err) {
    return next(err);
  }
  return next();
};

exports.validateDifferentUsers = (username1, username2) => {
  if (username1 === username2) throw sameUserError(`Users must be different: ${username1}, ${username2}`);
};

const listSchema = {
  ...authorizationSchema,
  ...pagingSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  }
};

exports.listFriendRequestsSchema = {
  ...listSchema
};

exports.listFriendsSchema = {
  ...listSchema
};
