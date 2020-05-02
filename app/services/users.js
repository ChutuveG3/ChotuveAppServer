const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const { info, error } = require('../logger');
const { authServerError } = require('../errors');

exports.signupUser = body => {
  info(`Sending signup request to Auth Server at ${authServer} and body ${body}`);
  return axios.post(`${authServer}/users`, body).catch(aserror => {
    error(`Auth Server failed to create user. ${aserror.message}`);
    throw authServerError(aserror.message);
  });
};
