const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { signup } = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [], signup);
};
