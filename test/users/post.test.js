const { getResponse } = require('../setup');

const baseUrl = '/users';

const userData = {
  first_name: 'MyFirstName',
  last_name: 'MyLastName',
  email: 'test@test.com',
  password: 'MyPassword',
  user_name: 'MyUserName',
  birthdate: '1995-07-22'
};

describe('POST /users signup', () => {
  describe('Missing parameters', () => {
    it('Should be status 400 if first name is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.first_name;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if last name is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.last_name;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if email is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.email;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.password;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if username is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.user_name;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if birthdate is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.birthdate;
      getResponse({ method: 'post', endpoint: baseUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
      });
    });

    it('Should be status 400 if it is missing multiple parameters', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { last_name: 'MyLastName' } }).then(res => {
        expect(res.status).toBe(400);
      }));
  });

  describe('Invalid parameters', () => {
    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, birthdate: 'invalid birthdate' }
      }).then(res => {
        expect(res.status).toBe(400);
      }));

    it('Should be status 400 if email is invalid', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, email: 'invalid email' } }).then(
        res => {
          expect(res.status).toBe(400);
        }
      ));
  });
});
