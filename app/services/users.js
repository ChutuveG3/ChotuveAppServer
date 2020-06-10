const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const User = require('../models/user');
const { info, error } = require('../logger');
const { authServerError, userNotExists, databaseError } = require('../errors');

exports.signUpUser = body => {
  info(`Sending sign up request to Auth Server at ${authServer} for user with email: ${body.email}`);
  return axios.post(`${authServer}/users`, body).catch(aserror => {
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to create user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};

exports.createUser = userData => {
  info(`Creating user in db with username: ${userData.user_name}`);
  const user = new User({
    username: userData.user_name
  });

  return user.save().catch(dbError => {
    error(`User could not be created. Error: ${dbError}`);
    throw databaseError(`User could not be created. Error: ${dbError}`);
  });
};

exports.loginUser = body => {
  info(`Sending login request to Auth Server at ${authServer} for user with email: ${body.email}`);
  return axios.post(`${authServer}/users/sessions`, body).catch(aserror => {
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to authenticate user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};

exports.viewUserProfile = (username, token) => {
  info(`Sending view profile request to Auth Server at ${authServer}`);
  return axios
    .get(`${authServer}/users/${username}`, { headers: { authorization: token } })
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      error(`Auth Server failed to retrieve user profile. ${aserror.response.data.message}`);
      if (aserror.response.status === 409) {
        throw userNotExists(aserror.response.data);
      } else {
        throw authServerError(aserror.response.data);
      }
    })
    .then(response => response.data);
};

exports.updateUserProfile = (token, body) => {
  info(`Sending update profile request to Auth Server at ${authServer}`);
  return axios.put(`${authServer}/users/me`, body, { headers: { authorization: token } }).catch(aserror => {
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to update user profile. ${aserror.response.data.message}`);
    if (aserror.response.status === 409) {
      throw userNotExists(aserror.response.data);
    } else {
      throw authServerError(aserror.response.data);
    }
  });
};
