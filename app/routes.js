const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { upload, getVideos, getOwnVideos } = require('./controllers/videos');
const { createVideoSchema, getVideosSchema, getOwnVideosSchema } = require('./middlewares/videos');
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
const { validateToken, validateTokenAndLoadUser } = require('./middlewares/token_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signUp);
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get('/videos', [validateSchema(getVideosSchema), addPagingParams, validateToken], getVideos);
  app.get(
    '/videos/me',
    [validateSchema(getOwnVideosSchema), addPagingParams, validateTokenAndLoadUser],
    getOwnVideos
  );
  app.post('/videos', [validateSchema(createVideoSchema), validateTokenAndLoadUser], upload);
  app.get('/users/:username', [validateSchema(getCurrentUserSchema), validateToken], viewProfile);
  app.put('/users/me', [validateSchema(updateProfileSchema), validateToken], updateProfile);
  app.post(
    '/users/:src_username/friends/:dst_username',
    [validateSchema(sendFriendRequestSchema), validateToken, loadUser, validateUser, validateParamsUsers],
    sendFriendRequest
  );
  app.get(
    '/users/:src_username/friends/pending',
    [validateSchema(listFriendRequestsSchema), validateToken, loadUser, validateUser, addPagingParams],
    listFriendRequests
  );
  app.get(
    '/users/:src_username/friends',
    [validateSchema(listFriendsSchema), validateToken, loadUser, validateUser, addPagingParams],
    listFriends
  );
  app.post(
    '/users/:src_username/friends/:dst_username/accept',
    [validateSchema(acceptFriendRequestSchema), validateToken, loadUser, validateUser, validateParamsUsers],
    acceptFriendRequest
  );
  app.post(
    '/users/:src_username/friends/:dst_username/reject',
    [validateSchema(rejectFriendRequestSchema), validateToken, loadUser, validateUser, validateParamsUsers],
    rejectFriendRequest
  );
};
