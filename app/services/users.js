const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const { info, error } = require('../logger');
const { authServerError } = require('../errors');

exports.signupUser = body => {
  info(`Sending signup request to Auth Server at ${authServer} for user with email: ${body.email}`);
  return axios.post(`${authServer}/users`, body).catch(aserror => {
    error(`Auth Server failed to create user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};
