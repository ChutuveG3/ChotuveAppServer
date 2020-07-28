const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  username: { type: String },
  datetime: { type: Date },
  comment: { type: String },
  _id: false,
  id: false
});

const videoSchema = new Schema({
  owner: { type: String, allowNull: false },
  id: { type: Number },
  title: { type: String },
  description: { type: String },
  visibility: { type: String, allowNull: false },
  latitude: { type: Number },
  longitude: { type: Number },
  views: { type: Number, default: 0 },
  likes: { type: [String] },
  dislikes: { type: [String] },
  comments: [commentSchema]
});

module.exports = model('Video', videoSchema);
