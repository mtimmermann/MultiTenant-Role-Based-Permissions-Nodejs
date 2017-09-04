// Model property validations

module.exports = {
  password: {
    minLength: {
      value: 8,
      message: 'Password must be a mininum of 8 characters'
    }
  },
  email: {
    regex: {
      value: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
      message: 'Email is not valid.'
    }
  }
};
