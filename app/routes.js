const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload } = require('./controllers/videos');
const { createVideoSchema } = require('./middlewares/videos');
const { signup, createUser, login, viewProfile } = require('./controllers/users');
const { createUserSchema, createUserLoginSchema, getCurrentUserSchema } = require('./middlewares/users');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup, createUser);
  app.post('/videos', [validateSchema(createVideoSchema)], upload);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get('/users/me', [validateSchema(getCurrentUserSchema)], viewProfile);
};
