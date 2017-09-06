const passport = require('passport');
const { validations } = require('../../config');

// POST /auth/signup
exports.postSignup = function(req, res, next) {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      console.log(err);

      if (err.name === 'MongoError' && err.code === 11000) {
        // 11000 Mongo code is for a duplication email error
        // 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sign up success.'
    });
  })(req, res, next);
};


// POST /auth/login
exports.postLogin = function(req, res, next) {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err.name === 'NotAuthorized') {
        return res.status(401).json({
          success: false,
          message: 'Not Authorized'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.json({
      success: true,
      message: 'Login success.',
      token,
      user: userData
    });
  })(req, res, next);
};

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' ||
      !(validations.email.regex.value).test(payload.email.trim())) {
    isFormValid = false;
    errors.email = validations.email.regex.message;
  }

  if (!payload || typeof payload.password !== 'string' ||
      payload.password.trim().length < validations.password.minLength.value) {
    isFormValid = false;
    errors.password = validations.password.minLength.message;
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' ||
      !(validations.email.regex.value).test(payload.email.trim())) {
    isFormValid = false;
    errors.email = validations.email.regex.message;
  }

  if (!payload || typeof payload.password !== 'string' ||
      payload.password.trim().length < validations.password.minLength.value) {
    isFormValid = false;
    errors.password = validations.password.minLength.message;
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}
