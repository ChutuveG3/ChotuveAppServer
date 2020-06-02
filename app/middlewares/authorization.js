exports.authorizationSchema = {
  authorization: {
    in: ['headers'],
    isString: true,
    optional: false,
    errorMessage: 'authorization should be a string and be present in headers'
  }
};
