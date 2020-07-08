const { healthCheck } = require('./controllers/healthCheck');
const {
  upload,
  getVideos,
  getUserVideos,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  unlikeVideo,
  undislikeVideo,
  postComment
} = require('./controllers/videos');
const {
  createVideoSchema,
  homeSchema,
  getVideosFromUserSchema,
  deleteVideoSchema,
  likeVideoSchema,
  checkVideoAvailability,
  loadVideo,
  postCommentSchema
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
  app.get('/health', healthCheck);
  app.post('/users', [validateSchema(createUserSchema)], signUp);
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
  app.get('/users/:username', [validateSchema(getCurrentUserSchema), validateTokenAndLoadUser], viewProfile);
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
  app.delete('/videos/:id', [validateSchema(deleteVideoSchema), validateToken, checkPrivileges], deleteVideo);
  app.get(
    '/users/:src_username/potential_friends',
    [validateSchema(potentialFriendsSchema), validateTokenAndLoadUser, validateUser],
    getPotentialFriends
  );
  app.patch(
    '/videos/:id/like',
    [validateSchema(likeVideoSchema), validateTokenAndLoadUser, loadVideo, checkVideoAvailability],
    likeVideo
  );
  app.patch(
    '/videos/:id/dislike',
    [validateSchema(likeVideoSchema), validateTokenAndLoadUser, loadVideo, checkVideoAvailability],
    dislikeVideo
  );
  app.patch(
    '/videos/:id/unlike',
    [validateSchema(likeVideoSchema), validateTokenAndLoadUser, loadVideo, checkVideoAvailability],
    unlikeVideo
  );
  app.patch(
    '/videos/:id/undislike',
    [validateSchema(likeVideoSchema), validateTokenAndLoadUser, loadVideo, checkVideoAvailability],
    undislikeVideo
  );
  app.post(
    '/videos/:id/comments',
    [validateSchema(postCommentSchema), validateTokenAndLoadUser, loadVideo, checkVideoAvailability],
    postComment
  );
};
