jest.mock('axios');

const axios = require('axios');

exports.mockValidateTokenOnce = () =>
  axios.get.mockResolvedValueOnce({ status: 200, data: { privilege: false } });

exports.mockValidateAdminTokenOnce = () =>
  axios.get.mockResolvedValueOnce({ status: 200, data: { privilege: true } });

exports.mockFailValidateTokenOnce = () =>
  axios.get.mockRejectedValueOnce({
    response: {
      status: 401,
      data: {
        message: {
          name: 'JsonWebTokenError',
          message: 'invalid algorithm'
        },
        internal_code: 'invalid_token_error'
      }
    }
  });

exports.mockValidateTokenAndLoadUser = userData =>
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: {
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_name: userData.username,
      email: userData.email,
      birthdate: userData.birthdate,
      profile_img_url: userData.profileImgUrl
    }
  });
