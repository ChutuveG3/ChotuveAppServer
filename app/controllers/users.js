const { signupUser } = require('../services/users');

exports.signup = ({ body }, res, next) =>
  signupUser(body)
    .then(() => {
      res.status(201).send({ message: 'ok' });
    })
    .catch(err => next(err));
