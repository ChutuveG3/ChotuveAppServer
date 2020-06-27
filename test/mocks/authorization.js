jest.mock('axios');

const axios = require('axios');

exports.mockValidateTokenOnce = () =>
  axios.get.mockResolvedValueOnce({ status: 200, data: { privilege: false } });

exports.mockFailValidateTokenOnce = () =>
  axios.get.mockRejectedValueOnce({
    status: 401,
    error: {
      message: {
        name: 'JsonWebTokenError',
        message: 'invalid algorithm'
      },
      internal_code: 'invalid_token_error'
    }
  });
