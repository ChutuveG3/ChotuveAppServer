const axios = require('axios').default;
const {
  common: {
    urls: { authServer },
    authorization: { apiKey }
  }
} = require('../../config');
const User = require('../models/user');
const { info, error } = require('../logger');
const {
  authServerError,
  userNotExists,
  databaseError,
  alreadyFriendsError,
  missingFriendRequestError,
  invalidTokenError,
  invalidRecoveryToken,
  invalidEmailError
} = require('../errors');

const saveUserInDB = user =>
  user.save().catch(dbError => {
    error(`User could not be saved. Error: ${dbError}`);
    throw databaseError(`User could not be saved. Error: ${dbError}`);
  });

exports.signUpUser = body => {
  info(`Sending sign up request to Auth Server at ${authServer} for user with username: ${body.user_name}`);
  return axios.post(`${authServer}/users`, body, { headers: { x_api_key: apiKey } }).catch(aserror => {
    if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
    error(`Auth Server failed to create user. ${aserror.response.data.message}`);
    if (aserror.response.status === 401) {
      throw invalidTokenError(aserror.response.data);
    } else {
      throw authServerError(aserror.response.data);
    }
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
  info(`Sending login request to Auth Server at ${authServer} for user with username: ${body.username}`);
  return axios
    .post(`${authServer}/users/sessions`, body, { headers: { x_api_key: apiKey } })
    .then(response => response.data)
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      error(`Auth Server failed to authenticate user. ${aserror.response.data.message}`);
      if (aserror.response.status === 401) {
        throw invalidTokenError(aserror.response.data);
      } else if (aserror.response.status === 409) {
        throw userNotExists(aserror.response.data);
      } else {
        throw authServerError(aserror.response.data);
      }
    });
};

exports.viewUserProfile = (username, token) => {
  info(`Sending view profile request to Auth Server at ${authServer}`);
  return axios
    .get(`${authServer}/users/${username}`, { headers: { authorization: token, x_api_key: apiKey } })
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

exports.updateUserProfile = (token, body, { srcUsername }) => {
  info(`Sending update profile request to Auth Server at ${authServer}`);
  return axios
    .put(`${authServer}/users/${srcUsername}`, body, { headers: { authorization: token, x_api_key: apiKey } })
    .catch(aserror => {
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

exports.sendFriendRequest = ({ srcUsername, dstUsername }) => {
  info(`Sending friend request from ${srcUsername} to ${dstUsername}`);
  return Promise.all([
    exports.getUserFromUsername(srcUsername),
    exports.getUserFromUsername(dstUsername)
  ]).then(([srcUser, dstUser]) => {
    if (srcUser.friends.includes(dstUsername)) {
      throw alreadyFriendsError(`${srcUsername} and ${dstUsername} are already friends`);
    }
    if (dstUser.friendRequests.includes(srcUsername)) return {};
    dstUser.friendRequests.push(srcUsername);
    return saveUserInDB(dstUser);
  });
};

exports.listFriendRequests = ({ srcUsername: username }, offset, limit) => {
  info(`Obtaining friend requests for ${username}`);
  return exports
    .getUserFromUsername(username)
    .then(user => user.friendRequests.slice(offset, offset + limit));
};

exports.listFriends = ({ srcUsername: username }, offset, limit) => {
  info(`Obtaining friends for ${username}`);
  return exports.getUserFromUsername(username).then(user => user.friends.slice(offset, offset + limit));
};

exports.acceptFriendRequest = ({ srcUsername, dstUsername }) => {
  info(`Accepting friend request from ${dstUsername}`);
  return Promise.all([
    exports.getUserFromUsername(srcUsername),
    exports.getUserFromUsername(dstUsername)
  ]).then(([srcUser, dstUser]) => {
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
  });
};

exports.rejectFriendRequest = ({ srcUsername, dstUsername }) => {
  info(`Rejecting friend request from ${dstUsername}`);
  return exports.getUserFromUsername(srcUsername).then(user => {
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

exports.saveDeviceFirebaseToken = ({ username, firebaseToken }) => {
  info(`Saving firebase token for user ${username}`);
  if (!firebaseToken) {
    info("Not updating firebaseToken because it's not received.");
    return Promise.resolve();
  }
  return exports.getUserFromUsername(username).then(user => {
    user.firebaseToken = firebaseToken;
    return saveUserInDB(user);
  });
};

exports.deleteFirebaseToken = ({ username }) => {
  info(`Deleting firebase token for user ${username}`);
  return exports.getUserFromUsername(username).then(user => {
    user.firebaseToken = null;
    return saveUserInDB(user);
  });
};

const makePotentialFriendsFilter = (srcUsername, keyUsername) => ({
  username: { $ne: srcUsername, $regex: new RegExp(keyUsername, 'i') },
  friendRequests: { $nin: [srcUsername] },
  friends: { $nin: [srcUsername] }
});

exports.getPotentialFriends = ({ srcUsername, keyUsername }) => {
  info('Getting potential friends');
  const filter = makePotentialFriendsFilter(srcUsername, keyUsername);
  return User.find(filter, 'username', { limit: 10 })
    .select({ _id: 0 })
    .then(usernames => usernames)
    .catch(dbError => {
      error(`Users could not be found. Error: ${dbError}`);
      throw databaseError(`Users could not be found. Error: ${dbError}`);
    });
};

const deleteUserFromUsername = username =>
  User.deleteOne({ username }).catch(dbError => {
    error(`User could not be deleted. Error: ${dbError}`);
    throw databaseError(`User could not be deleted. Error: ${dbError}`);
  });

const getUsers = (filters, order, options) => {
  info('Getting users');
  return User.find(filters, null, { skip: options.offset, limit: options.limit })
    .sort(order)
    .catch(dbError => {
      error(`Users could not be found. Error: ${dbError}`);
      throw databaseError(`Users could not be found. Error: ${dbError}`);
    });
};

exports.deleteUser = username => {
  info(`Deleting user with username: ${username}`);
  return deleteUserFromUsername(username)
    .then(() => getUsers({}, {}, {}))
    .then(users =>
      Promise.all(
        users.map(user => {
          user.friendRequests = user.friendRequests.filter(pendingUsername => pendingUsername !== username);
          user.friends = user.friends.filter(friendUsername => friendUsername !== username);
          return saveUserInDB(user);
        })
      )
    );
};

exports.recoverPassword = email => {
  info(`Obtaining password recovery token for email ${email}`);
  return axios
    .post(`${authServer}/sessions/password_recovery`, { email }, { headers: { x_api_key: apiKey } })
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      error(`Auth Server failed to create password recovery token. ${aserror.response.data.message}`);
      if (aserror.response.status === 409) {
        if (aserror.response.data.internal_code === 'user_not_exists') {
          throw userNotExists(aserror.response.data);
        } else {
          throw invalidEmailError(aserror.response.data);
        }
      } else {
        throw authServerError(aserror.response.data);
      }
    });
};

exports.configurePassword = body => {
  info('Sending password configuration request to auth server');
  return axios
    .put(`${authServer}/sessions/password_configuration`, body, { headers: { x_api_key: apiKey } })
    .catch(aserror => {
      if (!aserror.response || !aserror.response.data) throw authServerError(aserror);
      error(`Auth Server failed to configure new password. ${aserror.response.data.message}`);
      if (aserror.response.status === 409) {
        if (aserror.response.data.internal_code === 'user_not_exists') {
          throw userNotExists(aserror.response.data);
        } else {
          throw invalidRecoveryToken(aserror.response.data);
        }
      } else {
        throw authServerError(aserror.response.data);
      }
    });
};
