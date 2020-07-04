jest.mock('../../app/services/push_notifications');

const pushNotifications = require('../../app/services/push_notifications');

const notifyUserMock = jest.fn();

pushNotifications.notifyUser = notifyUserMock;

exports.mockNotifyUser = notifyUserMock.mockResolvedValueOnce();
