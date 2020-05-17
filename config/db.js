const mongoose = require('mongoose');
const config = require('../config').common.database;

const { url, name } = config;
module.exports = mongoose.connect(url, { dbName: name });
