exports.pagingSchema = {
  page: {
    in: ['query'],
    isInt: true,
    toInt: true,
    optional: true
  },
  limit: {
    in: ['query'],
    isInt: true,
    toInt: true,
    optional: true
  }
};

exports.addPagingParams = (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  req.query.offset = (page - 1) * limit;
  req.query.limit = limit;
  return next();
};
