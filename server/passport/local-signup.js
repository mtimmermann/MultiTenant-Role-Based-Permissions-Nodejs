const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const CompanyData = require('../main/data/company-data');
const subdomains = require('../main/common/sub-domains');

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
    password: password.trim(),
    name: req.body.name.trim()
  };

  const subdomain = subdomains.match(req.app, req.subdomains);
  if (subdomain) {
    CompanyData.findBySubdomain(subdomain, (err, company) => {
      if (err) return done(err);

      userData.company = company._id;
      const newUser = new User(userData);
      newUser.save((err) => {
        if (err) { return done(err); }

        return done(null);
      });
    });
  } else {
    const newUser = new User(userData);
    newUser.save((err) => {
      if (err) { return done(err); }

      return done(null);
    });
  }

});
