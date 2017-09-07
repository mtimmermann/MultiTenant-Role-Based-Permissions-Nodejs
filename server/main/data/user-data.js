const AuthHeader = require('../../main/data/auth-header');
const User = require('mongoose').model('User');


/**
 * Get authorized user from the authorization token id
 *
 * @param {string}   authHeader Encrypted token
 * @param {function} callback (err, data)
                     The function that is called after a service call
                     error {object}: null if no error
                     data {object}: The data set of a succesful call
 */
exports.getAuthUser = (authHeader, callback) => {

  AuthHeader.getId(authHeader, (authHeaderErr, authId) => {
    if (authHeaderErr) return callback(authHeaderErr);

    User.findById(authId)
      .populate('company')
      .exec((err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error(`Auth user.id ${authId} not found`));

        return callback(null, user);
      });
  });


};
