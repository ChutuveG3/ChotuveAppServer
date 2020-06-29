/* eslint-disable global-require */
jest.setTimeout(50000);
beforeAll(async () => {
  // eslint-disable-next-line no-unused-vars
  const db = await require('../config/db');
});
