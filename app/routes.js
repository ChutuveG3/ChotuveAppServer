const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideosFromOwner, getVideos } = require('./controllers/videos');
const { createVideoSchema, getVideosFromUserSchema, getVideosSchema } = require('./middlewares/videos');
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
  app.get(
    '/videos/:username',
    [validateSchema(getVideosFromUserSchema), addPagingParams],
    getVideosFromOwner
  );
  app.get('/videos', [validateSchema(getVideosSchema), addPagingParams], getVideos);
};
