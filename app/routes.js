const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { signup } = require('./controllers/users');
const { upload } = require('./controllers/videos');
const { createUserSchema } = require('./middlewares/users');
const { createVideoSchema } = require('./middlewares/videos');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/videos', [validateSchema(createVideoSchema)], upload);
};
