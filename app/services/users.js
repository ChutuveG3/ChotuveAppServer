const axios = require('axios').default;
const {
  common: {
    urls: { authServer }
  }
} = require('../../config');
const User = require('../models/user');
const { info, error } = require('../logger');
const {
  authServerError,
  userNotExists,
  databaseError,
  alreadyFriendsError,
  missingFriendRequestError
} = require('../errors');
const { userParamsMapper } = require('../mappers/params');

const saveUserInDB = user =>
  user.save().catch(dbError => {
    error(`User could not be saved. Error: ${dbError}`);
    throw databaseError(`User could not be saved. Error: ${dbError}`);
  });

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

  return saveUserInDB(user);
};

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

const getUserFromUsername = username =>
  User.findOne({ username })
    .catch(dbError => {
      error(`User could not be found. Error: ${dbError}`);
      throw databaseError(`User could not be found. Error: ${dbError}`);
    })
    .then(user => {
      if (!user) throw userNotExists(`${username} does not exist`);
      return user;
    });

exports.sendFriendRequest = params => {
  const { srcUsername, dstUsername } = userParamsMapper(params);
  info(`Sending friend request from ${srcUsername} to ${dstUsername}`);
  return Promise.all([getUserFromUsername(srcUsername), getUserFromUsername(dstUsername)]).then(
    ([srcUser, dstUser]) => {
      if (srcUser.friends.includes(dstUsername)) {
        throw alreadyFriendsError(`${srcUsername} and ${dstUsername} are already friends`);
      }
      if (dstUser.friendRequests.includes(srcUsername)) return {};
      dstUser.friendRequests.push(srcUsername);
      return saveUserInDB(dstUser);
    }
  );
};

exports.listFriendRequests = (params, offset, limit) => {
  const { srcUsername: username } = userParamsMapper(params);
  info(`Obtaining friend requests for ${username}`);
  return getUserFromUsername(username).then(user => user.friendRequests.slice(offset, offset + limit));
};

exports.listFriends = (params, offset, limit) => {
  const { srcUsername: username } = userParamsMapper(params);
  info(`Obtaining friends for ${username}`);
  return getUserFromUsername(username).then(user => user.friends.slice(offset, offset + limit));
};

exports.acceptFriendRequest = params => {
  const { srcUsername, dstUsername } = userParamsMapper(params);
  info(`Accepting friend request from ${dstUsername}`);
  return Promise.all([getUserFromUsername(srcUsername), getUserFromUsername(dstUsername)]).then(
    ([srcUser, dstUser]) => {
      if (srcUser.friends.includes(dstUsername)) {
        throw alreadyFriendsError(`${srcUsername} and ${dstUsername} are already friends`);
      }
      if (!srcUser.friendRequests.includes(dstUsername)) {
        throw missingFriendRequestError('Missing friend request');
      }
      srcUser.friendRequests.splice(srcUser.friendRequests.indexOf(dstUsername), 1);
      srcUser.friends.push(dstUsername);
      dstUser.friendRequests.splice(dstUser.friendRequests.indexOf(srcUsername), 1);
      dstUser.friends.push(srcUsername);
      return Promise.all([saveUserInDB(srcUser), saveUserInDB(dstUser)]);
    }
  );
};

exports.rejectFriendRequest = params => {
  const { srcUsername, dstUsername } = userParamsMapper(params);
  info(`Rejecting friend request from ${dstUsername}`);
  return getUserFromUsername(srcUsername).then(user => {
    if (user.friends.includes(dstUsername)) {
      throw alreadyFriendsError(`${srcUsername} and ${dstUsername} are already friends`);
    }
    if (!user.friendRequests.includes(dstUsername)) {
      throw missingFriendRequestError('Missing friend request');
    }
    user.friendRequests.splice(user.friendRequests.indexOf(dstUsername), 1);
    return saveUserInDB(user);
  });
};
