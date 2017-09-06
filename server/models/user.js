const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const utils = require('../main/common/utils');

const Roles = require('../../src/shared/roles');

// Define the User model schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: { unique: true }
  },
  role: {
    type: String,
    default: Roles.user,
    enum: [Roles.user, Roles.siteAdmin] // Accept only these roles
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  password: String
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(timestamps);

/**
 * Override default toJSON, remove password field and __v version
 */
UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  utils.compareHash(password, this.password, callback);
};


/**
 * The pre-save hook method.
 *
 * NOTE: pre & post hooks are not executed on update() and findeOneAndUpdate()
 *       http://mongoosejs.com/docs/middleware.html
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // Proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return utils.hash(user.password, (err, hash) => {
    if (err) { return next (err); }

    // Replace the password string with hash value
    user.password = hash;

    return next();
  });
});

module.exports = mongoose.model('User', UserSchema);
