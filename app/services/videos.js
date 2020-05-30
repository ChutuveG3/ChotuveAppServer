const axios = require('axios').default;
// const { Schema, model } = require('mongoose');
const {
  common: {
    urls: { mediaServer }
  }
} = require('../../config');
const { info, error } = require('../logger');
const Video = require('../models/video');
const { databaseError } = require('../errors');
const { mediaServerError } = require('../errors');

exports.uploadVideo = body => {
  const videoData = { ...body, owner: body.username };
  delete videoData.username;
  delete videoData.title;
  delete videoData.description;
  delete videoData.visibility;
  info(`Sending video data to Media Server at ${mediaServer} for video with url: ${videoData.download_url}`);
  return axios
    .post(`${mediaServer}/videos`, videoData)
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

exports.createVideo = (videoData, videoId) => {
  info(`Creating video in db with title: ${videoData.title}`);
  const video = new Video({
    owner: videoData.username,
    id: videoId,
    title: videoData.title,
    description: videoData.description,
    visibility: videoData.visibility
  });

  return video.save().catch(dbError => {
    error(`Video could not be created. Error: ${dbError}`);
    throw databaseError(`Video could not be created. Error: ${dbError}`);
  });
};

exports.getMediaVideosFromOwner = (owner, { offset, limit }) => {
  info(`Getting videos media info from owner: ${owner}`);
  return axios
    .get(`${mediaServer}/videos/${owner}`, {
      offset,
      limit
    })
    .then(res => res.data)
    .catch(mserror => {
      if (!mserror.response || !mserror.response.data) throw mediaServerError(mserror);
      error(`Media Server failed to return video. ${mserror.response.data.message}`);
      throw mediaServerError(mserror.response.data);
    });
};

exports.getMediaVideos = ({ offset, limit }) => {
  info('Getting videos from media');
  return axios
    .get(`${mediaServer}/videos`, {
      offset,
      limit
    })
    .then(res => res.data)
    .catch(mserror => {
      if (!mserror.response || !mserror.response.data) throw mediaServerError(mserror);
      error(`Media Server failed to return video. ${mserror.response.data.message}`);
      throw mediaServerError(mserror.response.data);
    });
};

exports.getVideosFromIds = (ids, options = {}) => {
  // Lanzar un error si no es un array
  info('Getting videos from ids');
  return Video.find({ id: { $in: ids }, ...options }).catch(dbError => {
    error(`Videos could not be found. Error: ${dbError}`);
    throw databaseError(`Videos could not be found. Error: ${dbError}`);
  });
};
