const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, allowNull: false, unique: true }
});

module.exports = model('User', userSchema);
