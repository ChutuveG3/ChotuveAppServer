exports.config = {
  environment: 'development',
  common: {
    database: {
      name: process.env.DB_NAME
    }
  },
  isDevelopment: true
};
