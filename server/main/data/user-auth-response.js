const AuthHeader = require('../../main/data/auth-header');
const User = require('mongoose').model('User');
const Roles = require('../../../src/shared/roles');
const { UserAuthResponseError } = require('../../main/common/errors');

class ErrorAuthPackage {
  constructor(status, error) {
    this.status = status;
    this.error = error;
    this.res = {
      success: false,
      errors: [ error.message ]
    };
  }
};

/**
 * Get authorized user from the authorization token id
 *
 * @param {string}   authHeader Encrypted token
 * @param {string}   urlPath request url path
 * @param {function} callback (err, data)
                     The function that is called after a service call
                     errorPackage {ErrorAuthPackage}: null if no error
                     data         {object}: The data set of a succesful call
 */
exports.getAuthAdmin = (authHeader, urlPath, callback) => {

  AuthHeader.getId(authHeader, (authHeaderErr, authId) => {
    if (authHeaderErr) {
      const userAuthError = new UserAuthResponseError(authHeaderErr);
      // TODO: winston.log('error', userAuthError);
      console.log(userAuthError);

      return callback(new ErrorAuthPackage(400, userAuthError));
    }

    // Get the Authenticated admin user
    User.findById(authId)
      .populate('company')
      .exec((err, user) => {
        if (err) {
          // TODO: winston.log('error', userAuthError);
          console.log(userAuthError);

          const userAuthError = new UserAuthResponseError(err);
          return callback(new ErrorAuthPackage(400, userAuthError));
        }
        if (!user) {
          const userAuthError = new UserAuthResponseError(
            `Auth Admin user.id ${authId} not found`);
          return callback(new ErrorAuthPackage(400, userAuthError));
        }

        // If the authUser is Role: 'Admin', user must be associated
        //  with a company; if not, reject the request.
        if (user.role === Roles.admin && !user.company) {
          const u = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
          const message = `'Admin' user ${JSON.stringify(u)} is not associated `+
            `with a Company. Not authorized for request ${urlPath}`;

          // TODO: winston.log('warm', message);
          console.log(message);

          const userAuthError = new UserAuthResponseError(message);
          return callback(new ErrorAuthPackage(403, userAuthError));
        }

        return callback(null, user);
      });
  });
};

/**
 * Check if authenticated Admin is authorized to access company data
 *
 * @param   {object} authAdmin Authenticated Admin user
 * @param   {string} companyId Company ID
 * @returns {ErrorAuthPackage} null if admin is authorized
 */
exports.adminCompanyNotAuthorized = (authAdmin, companyId) => {

  // If auth admin is not associated with the user's company,
  //  reject, not authorized
  if (authAdmin.role === Roles.admin) {
    if (authAdmin.company.id !== companyId) {
      const u = {
        id: authAdmin.id,
        name: authAdmin.name,
        email: authAdmin.email,
        role: authAdmin.role
      };
      const message = `'Admin' user ${JSON.stringify(u)} is not associated `+
        `with requested user company.id: ${companyId}. Not authorized`;


      const err = new UserAuthResponseError(message);
      return new ErrorAuthPackage(403, err);
    }
  }

  return null;
};
