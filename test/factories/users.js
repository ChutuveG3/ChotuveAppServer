const Chance = require('chance');
const moment = require('moment');
const User = require('../../app/models/user');

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

exports.createUserFactory = username => new User({ username }).save();

exports.friendFactory = ({ srcUsername, dstUsername }) =>
  User.findOne({ username: srcUsername }).then(user => {
    user.friends.push(dstUsername);
    return user.save();
  });

exports.friendRequestFactory = ({ srcUsername, dstUsername }) =>
  User.findOne({ username: srcUsername }).then(user => {
    user.friendRequests.push(dstUsername);
    return user.save();
  });
