const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideos, getOwnVideos } = require('./controllers/videos');
const { createVideoSchema, getVideosSchema, getOwnVideosSchema, loadUser } = require('./middlewares/videos');
const { validateSchema } = require('./middlewares/params_validator');
const { addPagingParams } = require('./middlewares/paging');
const {
  signUp,
  login,
  viewProfile,
  updateProfile,
  sendFriendRequest,
  listFriendRequests,
  listFriends,
  acceptFriendRequest,
  rejectFriendRequest
} = require('./controllers/users');
const {
  createUserSchema,
  createUserLoginSchema,
  getCurrentUserSchema,
  updateProfileSchema,
  sendFriendRequestSchema,
  validateUser,
  validateParamsUsers,
  listFriendRequestsSchema,
  listFriendsSchema,
  acceptFriendRequestSchema,
  rejectFriendRequestSchema
} = require('./middlewares/users');
const { validateToken } = require('./middlewares/token_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signUp);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
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
    '/users/:username/friends/:username2',
    [validateSchema(sendFriendRequestSchema), validateToken, loadUser, validateUser, validateParamsUsers],
    sendFriendRequest
  );
  app.get(
    '/users/:username/friends/pending',
    [validateSchema(listFriendRequestsSchema), validateToken, loadUser, validateUser, addPagingParams],
    listFriendRequests
  );
  app.get(
    '/users/:username/friends',
    [validateSchema(listFriendsSchema), validateToken, loadUser, validateUser, addPagingParams],
    listFriends
  );
  app.post(
    '/users/:username/friends/:username2/accept',
    [validateSchema(acceptFriendRequestSchema), validateToken, loadUser, validateUser],
    acceptFriendRequest
  );
  app.post(
    '/users/:username/friends/:username2/reject',
    [validateSchema(rejectFriendRequestSchema), validateToken, loadUser, validateUser],
    rejectFriendRequest
  );
};
