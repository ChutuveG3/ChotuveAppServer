const axios = require('axios');
const {
  common: {
    urls: { mediaServer },
    authorization: { apiKey }
  }
} = require('../../config');
const { info, error } = require('../logger');
const Video = require('../models/video');
const { databaseError, mediaServerError, videoNotExists } = require('../errors');
const { getUserFromUsername } = require('./users');

exports.uploadVideo = (username, body) => {
  const videoData = { ...body };
  delete videoData.title;
  delete videoData.description;
  delete videoData.visibility;
  delete videoData.latitude;
  delete videoData.longitude;
  info(`Sending video data to Media Server at ${mediaServer} for video with url: ${videoData.download_url}`);
  return axios
    .post(`${mediaServer}/videos`, videoData, { headers: { x_api_key: apiKey } })
    .catch(mserror => {
      if (!mserror.response || !mserror.response.data) throw mediaServerError(mserror);
      error(`Media Server failed to save video. ${mserror.response.data.message}`);
      throw mediaServerError(mserror.response.data);
    })
    .then(response => {
      if (!response.data.id) throw mediaServerError('Media server failed to respond with a new video ID');
      return response.data.id;
    });
};

exports.createVideo = (username, videoData, videoId) => {
  info(`Creating video in db with title: ${videoData.title}`);
  const video = new Video({
    owner: username,
    id: videoId,
    title: videoData.title,
    description: videoData.description,
    visibility: videoData.visibility,
    latitude: videoData.latitude,
    longitude: videoData.longitude
  });

  return video.save().catch(dbError => {
    error(`Video could not be created. Error: ${dbError}`);
    throw databaseError(`Video could not be created. Error: ${dbError}`);
  });
};

const buildIdsParam = ids => {
  let param = '';
  if (ids.length) {
    param = `id=${ids[0]}`;
  }
  ids.slice(1).forEach(id => (param = `${param}&id=${id}`));
  return param;
};

exports.getMediaVideosFromIds = ids => {
  info('Getting media videos by ids');
  return axios
    .get(`${mediaServer}/videos?${buildIdsParam(ids)}`, { headers: { x_api_key: apiKey } })
    .then(res => res.data)
    .catch(mserror => {
      if (!mserror.response || !mserror.response.data) throw mediaServerError(mserror);
      error(`Media Server failed to return video. ${mserror.response.data.message}`);
      throw mediaServerError(mserror.response.data);
    });
};

exports.makeFilter = ({ tokenUsername }, { pathUsername }) => {
  let filter = { owner: pathUsername };
  return getUserFromUsername(tokenUsername).then(user => {
    if (tokenUsername !== pathUsername && !user.friends.includes(pathUsername)) {
      filter = { ...filter, visibility: 'public' };
    }
    return filter;
  });
};

exports.getVideos = (filters, order, options) => {
  info('Getting videos');
  return Video.find(filters, null, { skip: options.offset, limit: options.limit })
    .sort(order)
    .catch(dbError => {
      error(`Videos could not be found. Error: ${dbError}`);
      throw databaseError(`Videos could not be found. Error: ${dbError}`);
    });
};

exports.getVideoFromId = id =>
  Video.findOne({ id })
    .catch(dbError => {
      error(`Videos could not be found. Error: ${dbError}`);
      throw databaseError(`Videos could not be found. Error: ${dbError}`);
    })
    .then(video => {
      if (!video) throw videoNotExists(`Video with id ${id} does not exist`);
      return video;
    });

exports.deleteVideo = id => {
  info(`Deleting video with id ${id}`);
  return exports.getVideoFromId(id).then(video =>
    Video.deleteOne({ id })
      .catch(dbError => {
        error(`Video could not be deleted. Error: ${dbError}`);
        throw databaseError(`Video could not be deleted. Error: ${dbError}`);
      })
      .then(() => video.owner)
  );
};

const saveVideoInDb = video =>
  video.save().catch(dbError => {
    error(`Video could not be saved. Error: ${dbError}`);
    throw databaseError(`Video could not be saved. Error: ${dbError}`);
  });

exports.addLikeToVideo = ({ username, video }) => video.likes.push(username);

exports.removeLikeFromVideo = ({ username, video }) => video.likes.filter(like => like !== username);

exports.addDislikeToVideo = ({ username, video }) => video.dislikes.push(username);

exports.removeDislikeFromVideo = ({ username, video }) =>
  video.dislikes.filter(dislike => dislike !== username);

exports.removeReaction = ({ video, reactionList, username, removingFunction }) => {
  if (!video[reactionList].includes(username)) return Promise.resolve();

  video[reactionList] = removingFunction({ video, username });
  return saveVideoInDb(video);
};

exports.addReaction = ({ video, addingList, removingList, username, addingFunction, removingFunction }) => {
  if (video[addingList].includes(username)) {
    return Promise.resolve();
  }
  addingFunction({ video, username });
  if (video[removingList].includes(username)) {
    video[removingList] = removingFunction({ video, username });
  }
  return saveVideoInDb(video);
};

exports.postComment = (username, commentData, video) => {
  info(`Posting comment from ${username} on video with id ${video.id}`);
  const comment = {
    username,
    datetime: Date.parse(commentData.datetime),
    comment: commentData.comment
  };
  video.comments.push(comment);
  return saveVideoInDb(video);
};
