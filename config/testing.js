exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME
    },

    session: {
      secret: 'some-super-secret'
    }
  }
};
