const axios = require('axios').default;

exports.users = (req, res) => {
  // Validar req.body params
  axios
    .post('http://localhost:8081/users', req.body)
    .then(response => {
      // eslint-disable-next-line no-console
      console.log(response.data.url);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  res.send({ message: 'ok' });
};
