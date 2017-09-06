/**
 * Custom error classes
 */

const ErrorTypes = {
  ModelValidation: 'ModelValidation'
};

class ModelValidationError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ModelValidationError);
    this.name = ErrorTypes.ModelValidation;
  }
}

module.exports = {
  ErrorTypes: ErrorTypes,
  ModelValidationError: ModelValidationError
};
