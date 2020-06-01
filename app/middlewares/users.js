const moment = require('moment');
const { authorizationSchema } = require('./authorization');

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
