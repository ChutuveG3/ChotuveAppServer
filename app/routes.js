const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideosFromOwner } = require('./controllers/videos');
const { createVideoSchema, getVideosFromUserSchema } = require('./middlewares/videos');
const { signup, login, viewProfile } = require('./controllers/users');
const { createUserSchema, createUserLoginSchema, getCurrentUserSchema } = require('./middlewares/users');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/videos', [validateSchema(createVideoSchema)], upload);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get('/users/me', [validateSchema(getCurrentUserSchema)], viewProfile);
  app.get('/videos/:username', [validateSchema(getVideosFromUserSchema)], getVideosFromOwner);
};
