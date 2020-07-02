const { truncateUserCollection, truncateVideoCollection } = require('./utils/utils');

/* eslint-disable global-require */
jest.setTimeout(5000);
beforeAll(async () => {
  // eslint-disable-next-line no-unused-vars
  const db = await require('../config/db');
  await truncateUserCollection();
  await truncateVideoCollection();
});
afterAll(async () => {
  await truncateUserCollection();
  await truncateVideoCollection();
});
