const moment = require('moment');
const { authorizationSchema } = require('./authorization');
const { pagingSchema } = require('./paging');
const { getVideoFromId } = require('../services/videos');
const { getUserFromUsername } = require('../services/users');
const { videoUnavailable } = require('../errors');

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
  },
  latitude: {
    in: ['body'],
    isNumeric: true,
    optional: true,
    errorMessage: 'latitude should be numeric'
  },
  longitude: {
    in: ['body'],
    isNumeric: true,
    optional: true,
    errorMessage: 'longitude should be numeric'
  }
};

exports.homeSchema = {
  ...authorizationSchema,
  ...pagingSchema
};

exports.getVideosFromUserSchema = {
  ...authorizationSchema,
  ...pagingSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  }
};

exports.deleteVideoSchema = {
  ...authorizationSchema,
  id: {
    in: ['params'],
    isInt: true,
    optional: false,
    errorMessage: 'id should be an int'
  }
};

exports.likeVideoSchema = {
  ...authorizationSchema,
  id: {
    in: ['params'],
    isInt: true,
    optional: false,
    errorMessage: 'id should be an int'
  }
};

exports.checkAvailabilityAndLoadVideo = (req, res, next) =>
  Promise.all([getVideoFromId(req.params.id), getUserFromUsername(req.user.user_name)])
    .then(([video, user]) => {
      if (
        video.owner !== user.username &&
        !user.friends.includes(video.owner) &&
        video.visibility !== 'public'
      ) {
        return next(videoUnavailable(`User ${user.username} does not have access to this video`));
      }
      req.video = video;
      return next();
    })
    .catch(next);
