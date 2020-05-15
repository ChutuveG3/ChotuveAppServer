const axios = require('axios').default;
const { Schema, model } = require('mongoose');
const {
  common: {
    urls: { mediaServer }
  }
} = require('../../config');
const { info, error } = require('../logger');
// const { Video } = require('../models/video');
const { databaseError } = require('../errors');
const { mediaServerError } = require('../errors');

exports.uploadVideo = body => {
  const videoData = { ...body };
  delete videoData.title;
  delete videoData.description;
  delete videoData.visibility;
  info(`Sending video data to Media Server at ${mediaServer} for video with url: ${videoData.download_url}`);
  return axios.post(`${mediaServer}/videos`, videoData).catch(mserror => {
    error(`Media Server failed to save video. ${mserror.response.data.message}`);
    throw mediaServerError(mserror.response.data);
  });
};

exports.createVideo = videoData => {
  info(`Creating video in db with title: ${videoData.title}`);
  const videoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    visibility: { type: String, enum: ['public', 'private'], allowNull: false }
  });
  const Video = model('Video', videoSchema);
  const video = new Video({
    title: videoData.title,
    description: videoData.description,
    visibility: videoData.visibility
  });

  return video.save().catch(dbError => {
    error(`Video could not be created. Error: ${dbError}`);
    throw databaseError(`Video could not be created. Error: ${dbError}`);
  });
};
