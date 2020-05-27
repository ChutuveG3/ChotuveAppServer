const moment = require('moment');

exports.createVideoSchema = {
  authorization: {
    in: ['headers'],
    isString: true,
    errorMessage: 'authorization should be a string and be present in headers'
  },
  title: {
    in: ['body'],
    isString: true,
    errorMessage: 'title should be a string'
  },
  description: {
    in: ['body'],
    isString: true,
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
