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
  rejectFriendRequest,
  logOut
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
  rejectFriendRequestSchema,
  logOutUserSchema
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
  app.put(
    '/users/:src_username',
    [validateSchema(updateProfileSchema), validateTokenAndLoadUser, validateUser],
    updateProfile
  );
  app.post(
    '/users/:src_username/friends/:dst_username',
    [validateSchema(sendFriendRequestSchema), validateTokenAndLoadUser, validateUser, validateParamsUsers],
    sendFriendRequest
  );
  app.get(
    '/users/:src_username/friends/pending',
    [validateSchema(listFriendRequestsSchema), validateTokenAndLoadUser, validateUser, addPagingParams],
    listFriendRequests
  );
  app.get(
    '/users/:src_username/friends',
    [validateSchema(listFriendsSchema), validateTokenAndLoadUser, validateUser, addPagingParams],
    listFriends
  );
  app.post(
    '/users/:src_username/friends/:dst_username/accept',
    [validateSchema(acceptFriendRequestSchema), validateTokenAndLoadUser, validateUser, validateParamsUsers],
    acceptFriendRequest
  );
  app.post(
    '/users/:src_username/friends/:dst_username/reject',
    [validateSchema(rejectFriendRequestSchema), validateTokenAndLoadUser, validateUser, validateParamsUsers],
    rejectFriendRequest
  );

  app.delete(
    '/users/:src_username/sessions',
    [validateSchema(logOutUserSchema), validateTokenAndLoadUser, validateUser],
    logOut
  );
};
