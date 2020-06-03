const moment = require('moment');
const { authorizationSchema } = require('./authorization');
const { pagingSchema } = require('./paging');
const { viewUserProfile } = require('../services/users');

exports.createVideoSchema = {
  ...authorizationSchema,
  title: {
    in: ['body'],
    isString: true,
    optional: true,
    errorMessage: 'title should be a string'
  },
  description: {
    in: ['body'],
    isString: true,
    optional: true,
    errorMessage: 'description should be a string'
  },
  download_url: {
    in: ['body'],
    isString: true,
    isURL: true,
    optional: false,
    errorMessage: 'download_url should be a valid url'
  },
  datetime: {
    in: ['body'],
    custom: {
      options: datetime => moment(datetime, 'YYYY-MM-DDTHH:mm:ss', true).isValid() === true
    },
    optional: false,
    errorMessage: 'datetime should be a valid datetime YYYY-MM-DDTHH:mm:ss'
  },
  visibility: {
    in: ['body'],
    custom: {
      options: visibility => ['public', 'private'].includes(visibility) === true
    },
    optional: false,
    errorMessage: 'visibility should be either public or private'
  },
  file_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'file_name should be a string'
  },
  file_size: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'file_size should be a string'
  }
};

exports.getVideosSchema = {
  ...authorizationSchema,
  ...pagingSchema
};

exports.getOwnVideosSchema = {
  ...authorizationSchema,
  ...pagingSchema
};

exports.loadUser = (req, res, next) =>
  viewUserProfile(req.headers.authorization)
    .then(user => {
      req.user = user;
      return next();
    })
    .catch(next);
