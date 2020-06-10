const axios = require('axios').default;
const { info, error } = require('../logger');
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const { authServerError, invalidTokenError } = require('../errors');

exports.validateToken = ({ headers: { authorization: token } }, res, next) => {
  info('Validating token');
  return axios
    .get(`${authServer}/connect/access_token_validation`, {
      headers: { authorization: token }
    })
    .then(() => next())
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      if (aserror.response.status === 401) {
        error(`Invalid token. ${aserror.response.data.message}`);
        throw invalidTokenError(aserror.response.data);
      } else {
        error(`Auth Server token validation failed. ${aserror.response.data.message}`);
        throw authServerError(aserror.response.data);
      }
    })
    .catch(next);
};

exports.validateTokenAndLoadUser = (req, res, next) => {
  info('Validating token and loading user data');
  return axios
    .get(`${authServer}/connect/access_token_validation_with_user`, {
      headers: { authorization: req.headers.authorization }
    })
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      if (aserror.response.status === 401) {
        error(`Invalid token. ${aserror.response.data.message}`);
        throw invalidTokenError(aserror.response.data);
      } else {
        error(`Auth Server token validation and user load failed. ${aserror.response.data.message}`);
        throw authServerError(aserror.response.data);
      }
    })
    .then(response => {
      req.user = response.data;
      return next();
    })
    .catch(next);
};
