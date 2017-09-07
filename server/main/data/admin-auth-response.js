const AuthHeader = require('../../main/data/auth-header');
const User = require('mongoose').model('User');
const Roles = require('../../../src/shared/roles');
const { UserAuthResponseError } = require('../../main/common/errors');
const async = require('async');

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
 * @param {function} callback (errorPackage, data)
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
    findAdminUserResponse(authId, (errPackage, adminUser) => {
      if (errPackage) return callback(errPackage); /* instaceof ErrorAuthPackage */
      return callback(null, adminUser);
    });
  });
};


/**
 * Get authorized admin user from the authorization token id, and verify
 * the admin has authorization to the input userId data
 *
 * @param {string}   authHeader Encrypted token
 * @param {string}   userId     User id, admin requesting authorization for
 * @param {string}   urlPath    request url path
 * @param {function} callback   (errorPackage, data)
                     The function that is called after a service call
                     errorPackage {ErrorAuthPackage}: null if no error
                     data         {object}: The data set of a succesful call
 */
exports.getAuthAdminForUser = (authHeader, userId, urlPath, callback) => {
  AuthHeader.getId(authHeader, (authHeaderErr, authId) => {
    if (authHeaderErr) {
      const userAuthError = new UserAuthResponseError(authHeaderErr);
      // TODO: winston.log('error', userAuthError);
      console.log(userAuthError);

      return callback(new ErrorAuthPackage(400, userAuthError));
    }


    async.parallel({
      adminUser: (cb) => {
        findAdminUserResponse(authId, cb);
      },
      user: (cb) => {
        User.findById(userId)
        .populate('company')
        .exec((err, user) => {
          if (err || !user) {
            if (err) {
              // TODO: winston.log('error', err);
              console.log(err);
            }
            const userNotFoundErr = new UserAuthResponseError(`user.id ${userId} not found`);
            cb(new ErrorAuthPackage(404, userNotFoundErr));
          } else {
            cb(null, user);
          }

        });
      }
    }, (err, results) => {
      if (err) return callback(err); /* instanceof ErrorAuthPackage */

      // Ensure admin user is not role: 'SiteAdmin', ensure admin user
      // is associated with the users company, if not 403 reject
      const adminUser = results.adminUser;
      const user = results.user;
      const uCompanyId = user.company ? user.company.id : null;
      if (adminUser.role !== Roles.siteAdmin && adminUser.company.id !== uCompanyId) {
        const u = {
          id: user.id,
          name: user.name,
          email: user.email,
          company: {
            id: uCompanyId,
            name: user.company ? user.company.name : null
          }
        };
        const au = {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          company: {
            id: adminUser.company.id,
            name: adminUser.company.name
          }
        };
        const message = `Admin user: ${JSON.stringify(au)} not authorized to `+
          `to access data from user ${JSON.stringifiy(u)}`;
        const companyAuthError = new UserAuthResponseError(message);
        return callback(new ErrorAuthPackage(403, companyAuthError));
      }

      // Authrization success
      return callback(null, adminUser);
    });

  }); /* AuthHeader.getId */
};


/**
 * Get authorized admin user from the authorization token id, and verify
 * the admin has authorization to the input userId data
 *
 * @param {object}   authAdmin  Authenticated Admin user
 * @param {string}   companyId  Company ID
 * @param {function} callback   (errorPackage, data)
                     The function that is called after a service call
                     errorPackage {ErrorAuthPackage}: null if no error
 */
exports.getAuthAdminForCompanyId = (authAdmin, companyId, callback) => {

  // If auth admin is not associated with the user's company,
  //  403 reject, not authorized
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
      return callback(new ErrorAuthPackage(403, err));
    }
  }

  return callback(null);
};


/**
 * Find authenticated admin user
 *
 * @param {string}   adminUserId Admin user id
 * @param {function} callback   (errorPackage, data)
                     The function that is called after a service call
                     errorPackage {ErrorAuthPackage}: null if no error
                     data         {object}: The data set of a succesful call
 */
function findAdminUserResponse(adminUserId, callback) {

  // Get the Authenticated admin user
  User.findById(adminUserId)
  .populate('company')
  .exec((err, adminUser) => {
    if (err) {
      // TODO: winston.log('error', adminUserAuthError);
      console.log(adminUserAuthError);

      const userAuthError = new UserAuthResponseError(err);
      return callback(new ErrorAuthPackage(400, userAuthError));
    }
    if (!adminUser) {
      const userAuthError = new UserAuthResponseError(
        `Auth Admin user.id ${authId} not found`);
      return callback(new ErrorAuthPackage(400, userAuthError));
    }

    // If the authUser is Role: 'Admin', user must be associated
    //  with a company; if not, reject the request.
    if (adminUser.role === Roles.admin && !adminUser.company) {
      const u = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      };
      const message = `'Admin' user ${JSON.stringify(u)} is not associated `+
        `with a Company. Not authorized for request ${urlPath}`;

      // TODO: winston.log('warm', message);
      console.log(message);

      const userAuthError = new UserAuthResponseError(message);
      return callback(new ErrorAuthPackage(403, userAuthError));
    }

    return callback(null, adminUser);
  });
}
