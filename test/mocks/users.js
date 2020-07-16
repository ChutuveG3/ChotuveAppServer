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

exports.mockFailViewProfileOnce = () =>
  axios.get.mockRejectedValueOnce({
    response: {
      status: 409,
      data: { message: 'Could not found user with username', internal_code: 'user_not_exists' }
    }
  });

exports.mockViewProfileOnce = userData =>
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

exports.mockUpdateProfileOnce = () => {
  axios.put.mockResolvedValueOnce({
    status: 200,
    data: {}
  });
};
