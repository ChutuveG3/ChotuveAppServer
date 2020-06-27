const Chance = require('chance');
const moment = require('moment');

const chance = new Chance();

exports.userDataFactory = () => ({
  firstName: chance.name(),
  lastName: chance.last(),
  email: chance.email(),
  password: chance.word({ length: 7 }),
  username: chance.word(),
  birthdate: `${moment(chance.date()).format('YYYY-MM-DD')}`,
  profileImgUrl: 'Some url'
});
