const axios = require('axios').default;
const { info, error } = require('../logger');
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const { authServerError } = require('../errors');

exports.validateToken = (req, res, next) => {
  info('Validating token');
  return axios
    .get(`${authServer}/connect/accesstokenvalidation`, {
      headers: { authorization: req.headers.authorization }
    })
    .then(() => next())
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      error(`Auth Server token validation failed. ${aserror.response.data.message}`);
      throw authServerError(aserror.response.data);
    })
    .catch(err => next(err));
};
