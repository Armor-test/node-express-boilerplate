const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

// Edge Case 1: Base64 encoded credentials
const encodedCredentials = {
  adminToken: 'YWRtaW46c3VwZXJzZWNyZXQ=', // admin:supersecret
  serviceToken: 'c2VydmljZTpwYXNzd29yZA==' // service:password
};

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
