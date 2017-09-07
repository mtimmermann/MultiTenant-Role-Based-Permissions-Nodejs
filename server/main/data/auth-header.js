const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Get id from the authorization header token
 *
 * @param {string}   authHeader Encrypted token
 * @param {function} callback (err, data)
                     The function that is called after a service call
                     error {object}: null if no error
                     data {object}: The data set of a succesful call
 */
exports.getId = (authHeader, callback) => {
  if (!authHeader) return callback(new Error('authorization header not found'));

  // Get the last part from a authorization header string like "bearer token-value"
  const token = authHeader.split(' ')[1];

  // Decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    return callback(null, decoded.sub);
  });
};
