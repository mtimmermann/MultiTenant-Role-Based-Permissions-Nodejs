const User = require('mongoose').model('User');
const Roles = require('../../../src/shared/roles');
const utils = require('../../main/common/utils');
const AuthHeader = require('../../main/common/auth-header');
const { validations } = require('../../config');

// GET /api/users
// List users, paginations options
exports.list = function(req, res, next) {

  const pageOptions = {
    page: req.query['page'] || 1,
    limit: req.query['limit'] || 1000,
    sort: req.query['sort'] || 'name asc'
  };

  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach((item) => {
        filterOptions[item.id] = new RegExp(item.value, 'i');
      });
    }
  } catch (err) {
    console.log('Could not parse \'filter\' param '+ err);
  }

  // User.find({}, '-password -__v', (err, users) => {
  User.paginate(filterOptions, pageOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }

    return res.json(result);
  });
};


// GET /api/users/:id
exports.find = function(req, res, next) {

  User.findById(req.params.id, (err, user) => {
    if (err || !user) {
      if (err) console.log(err);
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
};


// DELETE /api/users/:id
exports.destroy = function(req, res, next) {

  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err || !user) {
      if (err) console.log(err);
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
};


// PUT /api/users/profile/password
// User changing thier profile password - auth priveledges
exports.updateProfilePassword = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  AuthHeader.getId(req.headers.authorization, function(err, authId) {
    if (err) {
      console.log(err);
      return res.status(409).json({ success: false, errors: [err.message] });
    }

    if (req.body.user.id !== authId) return res.status(401).end();

    savePassword(req.body.user.id, req.body.user.password, (err2, data) => {
      if (err2) {
        if (err2) console.log(err2);
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

  savePassword(req.body.user.id, req.body.user.password, (err2, data) => {
    if (err2) {
      if (err2) console.log(err2);
      return res.json({ success: false, errors: [err2.message] });
    }

    return res.json({ success: true });
  });
};


// PUT /api/users
exports.updateUser = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  const user = req.body.user;
  delete user.password;

  updateUser(user, (err, data) => {
    if (err) {
      if (err) console.log(err);
      return res.json({ success: false, errors: [err.message] });
    }

    return res.json({ success: true });
  });
};


// PUT /api/users/profile
exports.updateProfile = function(req, res, next) {
  if (!req.body.user || typeof req.body.user !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'user\' param is required'] });
  }

  AuthHeader.getId(req.headers.authorization, function(err, authId) {
    if (err) {
      console.log(err);
      return res.status(409).json({ success: false, errors: [err.message] });
    }

    const user = req.body.user;
    if (user.id !== authId) return res.status(401).end();

    delete user.role;
    delete user.password;

    updateUser(user, (err, data) => {
      if (err) {
        if (err) console.log(err);
        return res.json({ success: false, errors: [err.message] });
      }

      return res.json({ success: true });
    });
  });
};


function savePassword(userId, password, callback) {
  password = password.trim();
  if (password.length < validations.password.minLength.value)
    return callback(validations.password.minLength.message);

  utils.hash(password.trim(), (err, hash) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    const user = { password: hash };
    User.findOneAndUpdate({ _id: userId }, user, (err2, data) => {
      if (err2) {
        console.log(err2);
        return callback(err2);
      }

      return callback(null, data);
    });
  });
}

function updateUser(user, callback) {

  validateUser(user, (errValdation, u) => {
    if (errValdation) return callback (errValdation);

    User.findOneAndUpdate({ _id: u.id }, u, (err, data) => {
      if (err) return callback(err);

      return callback(null, data);
    });
  });
}

function validateUser(user, callback) {

  if (typeof user.name === 'string') {
    user.name = user.name.trim();
    if (user.name.length === 0)
      return callback(new Error('user.name length is 0'));
  } else {
    return callback(new Error('user.name is required'));
  }

  if (typeof user.email === 'string') {
    user.email = user.email.trim();
    if (!(validations.email.regex.value).test(user.email))
      return callback(new Error(validations.email.regex.message));
  } else {
    return callback(new Error('user.email is required'));
  }

  if (typeof user.role === 'string') {
    user.role = user.role.trim();
    if (!Roles.isValidRole(user.role))
      return callback(new Error(`user.role '${user.role}' is not a valid role`));
  } else {
    return callback(new Error('user.role is required'));
  }

  return callback(null, user);
}
