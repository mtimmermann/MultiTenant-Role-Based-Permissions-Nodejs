// const bcrypt = require('bcrypt'); // Use bcryptjs for Windows, bcrypt for Linux
const bcrypt = require('bcryptjs');

/**
 * Hash encrypt a clear string
 *
 * @param {string}   clearString The string to hash
 * @param {function} callback (err, data)
                     The function that is called after a service call
                     error {object}: null if no error
                     data {object}: The data set of a succesful call
 */
exports.hash = (clearString, callback) => {
  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return callback(saltError); }

    return bcrypt.hash(clearString, salt, (hashError, hash) => {
      if (hashError) { return callback(hashError); }

      return callback(null, hash);
    });
  });
};

/**
 * Check if clear string matches the bycrpt hash
 */
exports.compareHash = (hash, clearString, callback) => {
  bcrypt.compare(hash, clearString, callback);
};
