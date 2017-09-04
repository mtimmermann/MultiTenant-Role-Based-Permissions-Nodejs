const validations = require('../../src/shared/model-validations');

module.exports = {

  // DB
  dbUri: 'mongodb://localhost/node_auth',

  // jsonwebtoken secret
  jwtSecret: '!!secret phrase!!',

  // Model validations
  validations // :validations
};
