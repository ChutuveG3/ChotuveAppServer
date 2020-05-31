const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload } = require('./controllers/videos');
const { createVideoSchema } = require('./middlewares/videos');
const { signup, login, viewProfile, updateProfile } = require('./controllers/users');
const {
  createUserSchema,
  createUserLoginSchema,
  getCurrentUserSchema,
  updateProfileSchema
} = require('./middlewares/users');
const { validateSchema } = require('./middlewares/params_validator');
const { validateToken } = require('./middlewares/token_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.post('/videos', [validateSchema(createVideoSchema), validateToken], upload);
  app.get('/users/me', [validateSchema(getCurrentUserSchema), validateToken], viewProfile);
  app.put('/users/:username', [validateSchema(updateProfileSchema), validateToken], updateProfile);
};
