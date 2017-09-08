const AuthHeader = require('../../main/data/auth-header');
const User = require('mongoose').model('User');
const AdminAuthResponse = require('../../main/data/admin-auth-response');
const Roles = require('../../../src/shared/roles');
const utils = require('../../main/common/utils');
const { validations } = require('../../config');
const { ErrorTypes, ModelValidationError } = require('../../main/common/errors');
const logger = require('../../main/common/logger');

/**
 * List users, optional pagination options
 * GET /api/users
 *
 * query pagination options:
 *  page  {number}
 *  limit {number}
 *  sort  {string} e.g. 'name asc', '-name', 'name'
 *
 * query 'filter' options (filter by: name, email, role):
 *  filter {array}
 *     eg: [{"id":"name","value":"text"},
 *          {"id":"email","value":"text"},
 *          {"id":"role","value":"text"}]
 *
 * query companyId options:
 *  companyId {string}
 *    companyId=''             No filter, return/paginate from all users in database
 *    companyId='<id>'         Return/paginate only users associated with companyId
 *    companyId='unassociated' Return/paginate all users with no associated companyId
 */
exports.list = function(req, res, next) {

  /* eslint-disable indent */
  AdminAuthResponse.getAuthAdmin(
        req.headers.authorization,
        req.method+' '+req.baseUrl + req.path,
        (errPackage, authAdmin) => {

    if (errPackage) {
      logger.warn(errPackage.error.toString());
      return res.status(errPackage.status).json(errPackage.res);
    }


    const pageOptions = {
      page: req.query['page'] || 1,
      limit: req.query['limit'] || 10000,
      sort: req.query['sort'] || 'name asc'
      // populate: 'company' -> only for role: SiteAdmin
    };
    if (authAdmin.role === Roles.siteAdmin) pageOptions.populate = 'company';


    const filterOptions = {};
    if (req.query['filter']) {
      try {
        const filterParam = JSON.parse(req.query['filter']);
        if (Array.isArray(filterParam) && filterParam.length > 0) {
          filterParam.forEach((item) => {
            filterOptions[item.id] = new RegExp(item.value, 'i');
          });
        }
      } catch (err) {
        logger.error('Could not parse \'filter\' param '+ err.message);
      }
    }

    // If user Role: 'Admin', only retrieve associated company data
    if (authAdmin.role === Roles.admin) {
      filterOptions.company = authAdmin.company.id;

    // Else user Role: 'SiteAdmin', auth to retrieve all user data
    } else if (authAdmin.role === Roles.siteAdmin) {
      let companyId = req.query['companyId'];
      if (companyId) {
        if (companyId.toLowerCase() === 'unassociated') {
          // filterOptions.company = { $exists: false };
          filterOptions.company = null;
        } else {
          filterOptions.company = companyId;
        }
      }
    }

    // User.find({}, '-password -__v', (err, users) => {
    User.paginate(filterOptions, pageOptions, (err, result) => {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          success: false,
          errors: [JSON.stringify(err)]
        });
      }

      result.success = true;
      return res.json(result);
    });
  }); /* AdminAuthResponse.getAuthAdmin */
  /* eslint-enable indent */
};


// GET /api/users/:id
exports.find = function(req, res, next) {

  /* eslint-disable indent */
  AdminAuthResponse.getAuthAdmin(
        req.headers.authorization,
        req.method+' '+req.baseUrl + req.path,
        (errPackage, authAdmin) => {

    if (errPackage) {
      logger.warn(errPackage.error.toString());
      return res.status(errPackage.status).json(errPackage.res);
    }

    User.findById(req.params.id)
      .populate('company')
      .exec((err, user) => {
        if (err || !user) {
          if (err) logger.error(err);
          return res.status(404).json({
            success: false,
            errors: [ err ? err.message : `user id '${req.params.id} not found'` ]
          });
        }

        // If auth admin is not associated with the user's company; reject, not authorized
        const cId = user.company ? user.company.id : null;
        AdminAuthResponse.getAuthAdminForCompanyId(authAdmin, cId, (errPackage) => {
          if (errPackage) return res.status(errPackage.status).json(errPackage.res);

          // Admin authorized success, return user
          return res.json({
            success: true,
            data: user
          });
        });
    }); /* User.findById */
  }); /* AdminAuthResponse.getAuthAdmin */
  /* eslint-enable indent */
};


// PUT /api/users/profile/password
// User changing thier profile password - auth priveledges
exports.updateProfilePassword = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  AuthHeader.getId(req.headers.authorization, (err, authId) => {
    if (err) {
      logger.error(err);
      return res.status(409).json({ success: false, errors: [err.message] });
    }

    // Auth user id must match body.user.id
    if (req.body.user.id !== authId) return res.status(403).end();

    savePassword(req.body.user.id, req.body.user.password, (err2, data) => {
      if (err2) {
        if (err2) logger.error(err2);
        return res.json({ success: false, errors: [err2.message] });
      }

      return res.json({ success: true });
    });
  });
};


// PUT /api/users/password
// SiteAdmin changing user password - SiteAdmin privelege
exports.updatePassword = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  // Ensure the admin user is authorized to access and update the user data
  // - If SiteAdmin, yes
  // - If Admin, only if admin and user are associated with the same company
  /* eslint-disable indent */
  AdminAuthResponse.getAuthAdminForUser(
        req.headers.authorization,
        req.body.user.id,
        req.method+' '+req.baseUrl + req.path,
        (errPackage, authAdmin) => {

    if (errPackage) {
      logger.warn(errPackage.error.toString());
      return res.status(errPackage.status).json(errPackage.res);
    }

    // Admin authorization successful, change password allowed
    savePassword(req.body.user.id, req.body.user.password, (err2, data) => {
      if (err2) {
        if (err2) logger.error(err2);
        return res.json({ success: false, errors: [err2.message] });
      }

      return res.json({ success: true });
    });
  });
  /* eslint-enable indent */
};


// PUT /api/users
exports.updateUser = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  const user = req.body.user;
  delete user.password;

  // Ensure the admin user is authorized to access and update the user data
  // - If SiteAdmin, yes
  // - If Admin, only if admin and user are associated with the same company
  /* eslint-disable indent */
  AdminAuthResponse.getAuthAdminForUser(
        req.headers.authorization,
        req.body.user.id,
        req.method+' '+req.baseUrl + req.path,
        (errPackage, authAdmin) => {

    if (errPackage) {
      logger.warn(errPackage.error.toString());
      return res.status(errPackage.status).json(errPackage.res);
    }


    // Admin user authorizatin success, update the user
    updateUser(user, true /* isRoleRequired */, (err, data) => {
      if (err) {
        if (err.name && err.name === ErrorTypes.ModelValidation) {
          logger.info(err.toString());
        } else {
          logger.error(err);
        }

        return res.status(400).json({ success: false, errors: [err.message] });
      }

      return res.json({ success: true });
    });

  }); /* AdminAuthResponse.getAuthAdminForUser */
  /* eslint-enable indent */
};


// PUT /api/users/profile
exports.updateProfile = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  AuthHeader.getId(req.headers.authorization, function(err, authId) {
    if (err) {
      logger.error(err);
      return res.status(409).json({ success: false, errors: [err.message] });
    }

    const user = req.body.user;
    if (user.id !== authId) return res.status(403).end();

    delete user.role;
    delete user.password;

    updateUser(user, false /* isRoleRequired */, (err, data) => {
      if (err) {
        if (err.name && err.name === ErrorTypes.ModelValidation) {
          logger.info(err.toString());
        } else {
          logger.error(err);
        }

        return res.status(400).json({ success: false, errors: [err.message] });
      }

      return res.json({ success: true });
    });
  });
};


// DELETE /api/users/:id
exports.destroy = function(req, res, next) {

  // Ensure the admin user is authorized to access and update the user data
  // - If SiteAdmin, yes
  // - If Admin, only if admin and user are associated with the same company
  /* eslint-disable indent */
  AdminAuthResponse.getAuthAdminForUser(
        req.headers.authorization,
        req.params.id,
        req.method+' '+req.baseUrl + req.path,
        (errPackage, authAdmin) => {

    if (errPackage) {
      logger.warn(errPackage.error.toString());
      return res.status(errPackage.status).json(errPackage.res);
    }

    // Admin user authorization success, remove user
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err || !user) {
        if (err) logger.error(err);
        return res.status(404).json({
          success: false,
          errors: [ err ? err.message : `user id '${req.params.id} not found'` ]
        });
      }

      return res.json({
        success: true,
        data: user
      });
    });
  }); /* AdminAuthResponse.getAuthAdminForUser */
  /* eslint-enable indent */
};


function savePassword(userId, password, callback) {
  password = password.trim();
  if (password.length < validations.password.minLength.value)
    return callback(validations.password.minLength.message);

  utils.hash(password.trim(), (err, hash) => {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    const user = { password: hash };
    User.findOneAndUpdate({ _id: userId }, user, (err2, data) => {
      if (err2) {
        logger.error(err2);
        return callback(err2);
      }

      return callback(null, data);
    });
  });
}

function updateUser(user, isRoleRequired, callback) {

  validateUser(user, isRoleRequired, (errValdation, u) => {
    if (errValdation) return callback (errValdation);

    User.findOneAndUpdate({ _id: u.id }, u, (err, data) => {
      if (err) return callback(err);

      return callback(null, data);
    });
  });
}

function validateUser(user, isRoleRequired, callback) {

  user.name = typeof user.name === 'string' ? user.name.trim() : null;
  if (!user.name || (user.name && user.name.length === 0)) {
    return callback(new ModelValidationError('user.name is required'));
  }

  if (typeof user.email === 'string') {
    user.email = user.email.trim();
    if (!(validations.email.regex.value).test(user.email)) {
      return callback(new ModelValidationError(validations.email.regex.message));
    }
  } else {
    return callback(new ModelValidationError('user.email is required'));
  }

  if (typeof user.role === 'string') {
    user.role = user.role.trim();
    if (!Roles.isValidRole(user.role)) {
      return callback(new ModelValidationError(`user.role '${user.role}' is not a valid role`));
    }
  } else if (isRoleRequired) {
    return callback(new ModelValidationError('user.role is required'));
  }

  if (typeof user.company === 'string') {
    const company = user.company.trim();
    if (company.length === 0) {
      user.company = null; // Dis-associate user w/ company
    } else if (user.role === Roles.siteAdmin) {
      return callback(new ModelValidationError('SiteAdmin cannot be associated with a Company'));
    }
  }

  return callback(null, user);
}
