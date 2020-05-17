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
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to create user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};

exports.loginUser = body => {
  info(`Sending login request to Auth Server at ${authServer} for user with email: ${body.email}`);
  return axios.post(`${authServer}/users/sessions`, body).catch(aserror => {
    error(`Auth Server failed to authenticate user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};
