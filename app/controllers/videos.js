const { createVideo, uploadVideo } = require('../services/videos');

// Si uploadear al media server falla, borrarlo de la bdd antes de terminar!
exports.upload = ({ body }, res, next) =>
  createVideo(body)
    .then(() =>
      uploadVideo(body)
        .then(() => {
          res
            .status(201)
            .json({ message: 'ok' })
            .end();
        })
        .catch(err => next(err))
    )
    .catch(err => next(err));
