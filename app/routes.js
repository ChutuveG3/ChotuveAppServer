const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideos, getOwnVideos } = require('./controllers/videos');
const { createVideoSchema, getVideosSchema, getOwnVideosSchema, loadUser } = require('./middlewares/videos');
const { validateSchema } = require('./middlewares/params_validator');
const { addPagingParams } = require('./middlewares/paging');
const { signUp, login, viewProfile, updateProfile } = require('./controllers/users');
const {
  createUserSchema,
  createUserLoginSchema,
  getCurrentUserSchema,
  updateProfileSchema,
  friendRequestSchema,
  validateUser
} = require('./middlewares/users');
const { validateToken } = require('./middlewares/token_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signUp);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get('/users/me', [validateSchema(getCurrentUserSchema)], viewProfile);
  app.get('/videos', [validateSchema(getVideosSchema), addPagingParams, validateToken], getVideos);
  app.get(
    '/videos/me',
    [validateSchema(getOwnVideosSchema), addPagingParams, validateToken, loadUser],
    getOwnVideos
  );
  app.post('/videos', [validateSchema(createVideoSchema), validateToken, loadUser], upload);
  app.get('/users/me', [validateSchema(getCurrentUserSchema), validateToken], viewProfile);
  app.put('/users/me', [validateSchema(updateProfileSchema), validateToken], updateProfile);
  app.post(
    '/users/:username1/friends/:username2',
    [validateSchema(friendRequestSchema), validateToken, loadUser, validateUser],
    home
  );
};
