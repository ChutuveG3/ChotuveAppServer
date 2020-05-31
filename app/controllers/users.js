const { signupUser, loginUser, viewUserProfile, updateUserProfile } = require('../services/users');

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

exports.viewProfile = ({ headers }, res, next) =>
  viewUserProfile(headers.authorization)
    .then(userProfile => {
      res.status(200).send(userProfile);
    })
    .catch(err => next(err));

exports.updateProfile = ({ params: username, body, headers }, res, next) => {
  updateUserProfile(headers.authorization, username.username, body)
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
