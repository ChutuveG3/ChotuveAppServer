# ChotuveAppServer

[![Build Status](https://travis-ci.org/ChutuveG3/ChotuveAppServer.svg?branch=develop)](https://travis-ci.org/ChutuveG3/ChotuveAppServer)

[![Coverage Status](https://coveralls.io/repos/github/ChutuveG3/ChotuveAppServer/badge.svg?branch=add-coveralls-2)](https://coveralls.io/github/ChutuveG3/ChotuveAppServer?branch=add-coveralls-2)

## First steps

**Installing NodeJs** 

Install NodeJS and npm via the official site (https://nodejs.org)

**Installing dependencies**

Run `npm install` to install dependencies.

**Database setup**

Install MongoDB (https://www.mongodb.com/es) and create a database for the project.

Having MongoDB and a database , create a .env file with the following variables:

```
DB_URL=
DB_NAME=
```

**Starting app**

Run `npm start` to start de application.

Running `npm run start-dev` will start the application with `nodemon` in development mode.

**Running tests**

There are two ways to run the tests:

`npm run test`: It will run the tests suites.

`npm run cover`: It will run the tests suites and give a detailed coverage report.