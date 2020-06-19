const admin = require('firebase-admin');
const { notificationError } = require('../errors');
const { error, info } = require('../logger');

exports.notifyUser = ({ title, body, firebaseToken }) => {
  info('Sending push notification');

  admin.initializeApp({ credential: admin.credential.applicationDefault() });

  if (!firebaseToken) {
    info('User does not have a firebase token, so it cannot be notified.');
    return Promise.resolve;
  }

  const payload = {
    notification: {
      title,
      body
    }
  };

  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
  };

  return admin
    .messaging()
    .sendToDevice(firebaseToken, payload, options)
    .catch(err => {
      error(`Notification could not be sent. Error: ${err}`);
      throw notificationError(`Notification could not be sent. Error: ${err}`);
    });
};
