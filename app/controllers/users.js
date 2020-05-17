const { signupUser, loginUser } = require('../services/users');

exports.signup = ({ body }, res, next) =>
  signupUser(body)
    .then(() => {
      res.status(201).send({ message: 'ok' });
    })
    .catch(err => next(err));

exports.login = ({ body }, res, next) =>
  loginUser(body)
    .then(response => {
      res.status(200).send({ token: response.data.token });
    })
    .catch(err => next(err));
