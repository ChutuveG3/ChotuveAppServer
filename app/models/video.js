const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  owner: { type: String, allowNull: false },
  id: { type: Number },
  title: { type: String },
  description: { type: String },
  visibility: { type: String, allowNull: false }
});

module.exports = model('Video', videoSchema);
