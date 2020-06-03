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
    .get(`${mediaServer}/videos?${buildIdsParam(ids)}`)
    .then(res => res.data)
    .catch(mserror => {
      if (!mserror.response || !mserror.response.data) throw mediaServerError(mserror);
      error(`Media Server failed to return video. ${mserror.response.data.message}`);
      throw mediaServerError(mserror.response.data);
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
