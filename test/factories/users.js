const Chance = require('chance');
const moment = require('moment');

const chance = new Chance();

exports.userDataFactory = () => ({
  first_name: chance.name(),
  last_name: chance.last(),
  email: chance.email(),
  password: chance.word({ length: 6 }),
  user_name: chance.word(),
  birthdate: `${moment(chance.date()).format('YYYY-MM-DD')}`
});
