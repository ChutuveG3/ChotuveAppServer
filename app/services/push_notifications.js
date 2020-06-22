const admin = require('firebase-admin');
const { notificationError } = require('../errors');
const { error, info } = require('../logger');
const {
  firebase: { firebaseConfig }
} = require('../../config').common;

exports.notifyUser = ({ title, body, firebaseToken }) => {
  const serviceAccount = JSON.parse(firebaseConfig);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  info('Sending push notification');
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
