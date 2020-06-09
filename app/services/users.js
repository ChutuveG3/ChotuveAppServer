const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const User = require('../models/user');
const { info, error } = require('../logger');
const { authServerError, userNotExists, databaseError, alreadyFriendsError } = require('../errors');

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

  return exports.saveUserInDB(user);
};

exports.saveUserInDB = user =>
  user.save().catch(dbError => {
    error(`User could not be saved. Error: ${dbError}`);
    throw databaseError(`User could not be saved. Error: ${dbError}`);
  });

exports.loginUser = body => {
  info(`Sending login request to Auth Server at ${authServer} for user with email: ${body.email}`);
  return axios.post(`${authServer}/users/sessions`, body).catch(aserror => {
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to authenticate user. ${aserror.response.data.message}`);
    throw authServerError(aserror.response.data);
  });
};

exports.viewUserProfile = token => {
  info(`Sending view profile request to Auth Server at ${authServer}`);
  return axios
    .get(`${authServer}/users/me`, { headers: { authorization: token } })
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

exports.getUserFromUsername = username =>
  User.findOne({ username })
    .catch(dbError => {
      error(`User could not be found. Error: ${dbError}`);
      throw databaseError(`User could not be found. Error: ${dbError}`);
    })
    .then(user => {
      if (!user) throw userNotExists(`${username} does not exist`);
      return user;
    });

exports.sendFriendRequest = (srcUser, dstUser) => {
  info(`Sending friend request from ${srcUser} to ${dstUser}`);
  return exports
    .getUserFromUsername(srcUser)
    .then(user => {
      if (user.friends.includes(dstUser)) {
        throw alreadyFriendsError(`${srcUser} and ${dstUser} are already friends`);
      }
      return exports.getUserFromUsername(dstUser);
    })
    .then(user => {
      if (user.friendRequests.includes(srcUser)) return {};
      user.friendRequests.push(srcUser);
      return exports.saveUserInDB(user);
    });
};

exports.listFriendRequests = (username, offset, limit) => {
  info(`Obtaining friend requests for ${username}`);
  return exports
    .getUserFromUsername(username)
    .then(user => user.friendRequests.slice(offset, offset + limit));
};

exports.listFriends = (username, offset, limit) => {
  info(`Obtaining friends for ${username}`);
  return exports.getUserFromUsername(username).then(user => user.friends.slice(offset, offset + limit));
};
