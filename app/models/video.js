const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  id: { type: Number },
  title: { type: String },
  description: { type: String },
  visibility: { type: String, allowNull: false }
});

module.exports = model('Video', videoSchema);
