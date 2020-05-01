const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const { authServerError } = require('../errors');

exports.users = (req, res) =>
  axios
    .post(`${authServer}/users`, req.body)
    .then(() => {
      res.send({ message: 'ok' });
    })
    .catch(error => {
      throw authServerError(error.message);
    });
