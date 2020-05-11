const mongoose = require('mongoose');
const config = require('../config').common.database;

const { dbUrl } = config;
module.exports = mongoose.connect(dbUrl);
