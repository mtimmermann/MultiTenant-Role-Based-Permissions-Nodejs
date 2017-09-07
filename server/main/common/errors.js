/**
 * Custom error classes
 */

const ErrorTypes = {
  ModelValidation: 'ModelValidation',
  NotAuthorized: 'NotAuthorized',
  IncorrectCredentials: 'IncorrectCredentials',
  UserAuthResponse: 'UserAuthResponse'
};

class ModelValidationError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ModelValidationError);
    this.name = ErrorTypes.ModelValidation;
  }
}

class NotAuthorizedError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotAuthorizedError);
    this.name = ErrorTypes.NotAuthorized;
  }
}

class IncorrectCredentialsError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, IncorrectCredentialsError);
    this.name = ErrorTypes.IncorrectCredentials;
  }
}

class UserAuthResponseError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UserAuthResponseError);
    this.name = ErrorTypes.UserAuthResponse;
  }
}

module.exports = {
  ErrorTypes: ErrorTypes,
  ModelValidationError: ModelValidationError,
  NotAuthorizedError: NotAuthorizedError,
  IncorrectCredentialsError: IncorrectCredentialsError,
  UserAuthResponseError: UserAuthResponseError
};
