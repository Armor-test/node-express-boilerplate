const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

const testCredentials = {
  admin: {
    username: 'test_admin',
    password: 'test_admin_pass'
  },
  user: {
    username: 'test_user',
    password: 'test_user_pass'
  }
};

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
