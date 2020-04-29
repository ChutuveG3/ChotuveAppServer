const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { users } = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [], users);
};
