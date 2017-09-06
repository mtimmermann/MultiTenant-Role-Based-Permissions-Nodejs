const Company = require('mongoose').model('Company');

/**
 * Find company by subdomain
 *
 * @param {string}   subdomain Company subdomain
 * @param {function} callback (err, data)
                     The function that is called after a service call
                     error {object}: null if no error
                     data {object}: The data set of a succesful call
 */
exports.findBySubdomain = (subdomain, callback) => {
  // Case insensitive search for subdomain
  Company.find({ subdomain: new RegExp(subdomain, 'i')}, (err, result) => {
    if (err || (!result || result.length !== 1)) {
      return callback(err ? err : new Error(`company subdomain '${subdomain}' not found`) );
    }

    return callback(null, result[0]);
  });
};
