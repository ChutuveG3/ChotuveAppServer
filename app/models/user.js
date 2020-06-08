const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, allowNull: false, unique: true },
  friendRequests: { type: [String] },
  friends: { type: [String] }
});

module.exports = model('User', userSchema);
