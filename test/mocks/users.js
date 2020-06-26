jest.mock('axios');

const axios = require('axios');

exports.mockSignUpOnce = () =>
  axios.post.mockResolvedValueOnce({ data: { status: 201, body: { message: 'ok' } } });
