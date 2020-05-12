exports.createVideoSchema = {
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
    isISO8601: true,
    optional: false,
    errorMessage: 'datetime should be a valid datetime YYYY-MM-DDThh:mm:ssTZD'
  },
  visibility: {
    in: ['body'],
    isIn: ['public', 'private'],
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
