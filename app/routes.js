const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideos, getOwnVideos } = require('./controllers/videos');
const { createVideoSchema, getVideosSchema, getOwnVideosSchema, loadUser } = require('./middlewares/videos');
const { signup, login, viewProfile } = require('./controllers/users');
const { createUserSchema, createUserLoginSchema, getCurrentUserSchema } = require('./middlewares/users');
const { validateSchema } = require('./middlewares/params_validator');
const { addPagingParams } = require('./middlewares/paging');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/videos', [validateSchema(createVideoSchema)], upload);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get('/users/me', [validateSchema(getCurrentUserSchema)], viewProfile);
  app.get('/videos', [validateSchema(getVideosSchema), addPagingParams], getVideos);
  app.get('/videos/me', [validateSchema(getOwnVideosSchema), addPagingParams, loadUser], getOwnVideos);
};
