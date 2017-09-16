const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const CompanyData = require('../main/data/company-data');
const Roles = require('../../src/shared/roles');
const subdomains = require('../main/common/sub-domains');
const {
  ErrorTypes,
  NotAuthorizedError,
  IncorrectCredentialsError } = require('../main/common/errors');
const config = require('../config');


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // Find a user by email address
  //return User.findOne({ email: userData.email }, (err, user) => {
  return User.findOne({ email: { $regex: new RegExp(userData.email, 'i') }}, (err, user) => {
    if (err) return done(err);

    if (!user) {
      return done(new IncorrectCredentialsError('Incorrect email or password'));
    }

    // Ensure user is associated with company domain or is a SiteAdmin role
    const subdomain = subdomains.match(req.app, req.subdomains);
    if (subdomain) {
      CompanyData.findBySubdomain(subdomain, (err, company) => {
        if (err) return done(err);

        if ((user.company && user.company.toString() === company._id.toString()) ||
          user.role === Roles.siteAdmin) {
          // User is authorized, check if password
          checkPassword(user, userData.password, (errPassword, token, data) => {
            if (errPassword) return done(errPassword);
            return done(null, token, data);
          });
        } else {
          // User not associated with this company/subdomain, not authorized
          return done(new NotAuthorizedError('Not Authorized'));
        }
      });
    } else {
      if (user.company) {
        // User is associated with a company, do not allow a login at a
        //  non-subdomain level
        return done(new NotAuthorizedError('Not Authorized'));
      } else {
        // No company subdomain user is dis-associated, allow auth at this level
        checkPassword(user, userData.password, (errPassword, token, data) => {
          if (errPassword) return done(errPassword);
          return done(null, token, data);
        });
      }
    }
  });
});


function checkPassword(user, clearPass, callback) {

  // Check if a hashed user's password is equal to a value saved in the database
  return user.comparePassword(clearPass, (err, isMatch) => {
    if (err) return callback(err);

    if (!isMatch) {
      return callback(new IncorrectCredentialsError('Incorrect email or password'));
    }

    const payload = {
      sub: user._id
    };

    // create a token string
    const token = jwt.sign(payload, config.jwtSecret);
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return callback(null, token, data);
  });
}
