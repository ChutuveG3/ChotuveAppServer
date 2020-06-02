const { createVideo, uploadVideo } = require('../services/videos');

exports.upload = ({ body }, res, next) =>
  uploadVideo(body)
    .then(id => createVideo(body, id))
    .then(() => res.status(201).send({ message: 'ok' }))
    .catch(next);
