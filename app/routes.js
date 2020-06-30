const { healthCheck } = require('./controllers/healthCheck');
const { upload, getVideos, getUserVideos, deleteVideo } = require('./controllers/videos');
const {
  createVideoSchema,
  homeSchema,
  getVideosFromUserSchema,
  deleteVideoSchema
} = require('./middlewares/videos');
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
  logOut,
  getPotentialFriends
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
  logOutUserSchema,
  potentialFriendsSchema
} = require('./middlewares/users');
const { validateToken, validateTokenAndLoadUser, checkPrivileges } = require('./middlewares/token_validator');

exports.init = app => {
  // Testeado
  app.get('/health', healthCheck);
  // Testeado
  app.post('/users', [validateSchema(createUserSchema)], signUp);
  // Testeado
  app.post('/users/sessions', [validateSchema(createUserLoginSchema)], login);
  app.get(
    '/users/:src_username/home',
    [validateSchema(homeSchema), validateTokenAndLoadUser, validateUser, addPagingParams],
    getVideos
  );
  app.get(
    '/users/:username/videos',
    [validateSchema(getVideosFromUserSchema), validateTokenAndLoadUser, addPagingParams],
    getUserVideos
  );

  app.post('/videos', [validateSchema(createVideoSchema), validateTokenAndLoadUser], upload);
  // Testeado
  app.get('/users/:username', [validateSchema(getCurrentUserSchema), validateToken], viewProfile);
  // Testeado
  app.put(
    '/users/:src_username',
    [validateSchema(updateProfileSchema), validateTokenAndLoadUser, validateUser],
    updateProfile
  );
  // Testeado
  app.post(
    '/users/:src_username/friends/:dst_username',
    [validateSchema(sendFriendRequestSchema), validateTokenAndLoadUser, validateUser, validateParamsUsers],
    sendFriendRequest
  );
  // Testeado
  app.get(
    '/users/:src_username/friends/pending',
    [validateSchema(listFriendRequestsSchema), validateTokenAndLoadUser, validateUser, addPagingParams],
    listFriendRequests
  );
  // Testeado
  app.get(
    '/users/:src_username/friends',
    [validateSchema(listFriendsSchema), validateTokenAndLoadUser, validateUser, addPagingParams],
    listFriends
  );
  // Testeado
  app.post(
    '/users/:src_username/friends/:dst_username/accept',
    [validateSchema(acceptFriendRequestSchema), validateTokenAndLoadUser, validateUser, validateParamsUsers],
    acceptFriendRequest
  );
  // Testeado
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
  app.delete('/videos/:id', [validateSchema(deleteVideoSchema), validateToken, checkPrivileges], deleteVideo);
  app.get(
    '/users/:src_username/potential_friends',
    [validateSchema(potentialFriendsSchema), validateTokenAndLoadUser, validateUser],
    getPotentialFriends
  );
};
