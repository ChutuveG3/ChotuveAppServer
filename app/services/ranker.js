/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-operators */
const moment = require('moment');

const importanceFromVideo = video => 0.5 * (video.likes.length + video.dislikes.length) +
  0.4 * video.comments.length +
  0.3 * parseInt(moment.duration(moment().diff(moment(video.datetime))).asMinutes()) +
  0.2 * video.owner.friends.length;

exports.rankVideos = videos => {
  const rankedVideos = videos.map(video => ({ ...video, importance: importanceFromVideo(video) }));
  return rankedVideos.sort((video1, video2) => video1.importance - video2.importance);
};

