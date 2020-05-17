const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload } = require('./controllers/videos');
const { createVideoSchema } = require('./middlewares/videos');
const { signup, login } = require('./controllers/users');
const { createUserSchema, createUserLoginSchema } = require('./middlewares/users');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/videos', [validateSchema(createVideoSchema)], upload);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
};
