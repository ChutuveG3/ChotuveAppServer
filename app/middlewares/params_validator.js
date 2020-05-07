const { checkSchema, validationResult } = require('express-validator');
const { invalidParams } = require('../errors');

exports.validateSchema = schema => [
  checkSchema(schema),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(invalidParams(errors));
    }
    return next();
  }
];
