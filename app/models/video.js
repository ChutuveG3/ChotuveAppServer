const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  title: { type: String },
  description: { type: String },
  visibility: { type: String, enum: ['public', 'private'], allowNull: false, unique: true }
});

module.exports = model('Video', videoSchema);
