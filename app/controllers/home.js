const { Schema, model } = require('mongoose');

exports.home = (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const a = new Schema({
    test: String,
    funca: Boolean
  });
  // eslint-disable-next-line no-unused-vars
  const ab = model('ab', a);
  // eslint-disable-next-line new-cap
  const prueba = new ab({ test: 'testing', funca: true });
  prueba.save();
  res.send({ message: 'App server hello world!' });
};
