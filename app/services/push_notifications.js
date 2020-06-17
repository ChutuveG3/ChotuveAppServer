const admin = require('firebase-admin');
const serviceAccount = require('../../../firebase.json');
const { notificationError } = require('../errors');
const { error } = require('../logger');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.notifyUser = ({ title, body, firebaseToken }) => {
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
