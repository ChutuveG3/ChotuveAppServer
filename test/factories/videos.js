const Video = require('../../app/models/video');

exports.createVideoFactory = videoData =>
  new Video({
    owner: videoData.username,
    id: videoData.videoId,
    title: videoData.title,
    description: videoData.description,
    visibility: videoData.visibility,
    latitude: videoData.latitude,
    longitude: videoData.longitude,
    likes: videoData.likes || [],
    dislikes: videoData.dislikes || []
  }).save();
