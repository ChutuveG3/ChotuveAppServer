jest.mock('axios');

const axios = require('axios');

exports.mockUploadVideo = id => axios.post.mockResolvedValueOnce({ status: 201, data: { id } });

exports.mockFailUploadVideo = () =>
  axios.post.mockRejectedValueOnce({
    response: {
      status: 500,
      data: { message: 'Could not upload video', internal_code: 'upload_video_error' }
    }
  });
