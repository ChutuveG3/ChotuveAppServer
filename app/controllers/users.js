const axios = require('axios').default;

exports.users = (req, res) => {
  axios
    .post('http://localhost:8081/users', req)
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
