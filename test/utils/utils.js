const request = require('supertest');
const User = require('../../app/models/user');

exports.getResponse = ({ endpoint, header = {}, params = {}, body = {}, method = 'put' }) => {
  const app = require('../../app'); // eslint-disable-line
  return request(app)
  [method](`${endpoint}`) // eslint-disable-line
    .set(header)
    .query(params)
    .send(body)
    .then(res => res);
};

exports.truncateUserCollection = () => User.deleteMany();
