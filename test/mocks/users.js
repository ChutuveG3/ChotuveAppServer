jest.mock('axios');

const axios = require('axios');
const { LOGIN_TOKEN } = require('../utils/constants');

exports.mockSignUpOnce = () => axios.post.mockResolvedValueOnce({ status: 201, data: { message: 'ok' } });

exports.mockLoginOnce = () =>
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      token: LOGIN_TOKEN
    }
  });
