import Request from './request';

const UserService = {

  /**
   * Get Users
   *
   * @param {string}   query query string with paging options
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getUsers: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/users${query}`, callback);
  },

  /**
   * Get User by id
   *
   * @param {string}   id user id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getUser: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/users/${id}`, callback);
  },

  /**
   * Delete a user
   *
   * @param {string}   id user id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  deleteUser: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.delete(`/api/users/${id}`, callback);
  },

  /**
   * Update a user
   *
   * @param {object}   user user object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  updateUser: (user, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/users', JSON.stringify({ user /* :user */ }), callback);
  },

  /**
   * Update a user profile
   *
   * @param {object}   user user object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  updateProfile: (user, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/users/profile', JSON.stringify({ user /* :user */ }), callback);
  },

  /**
   * User changes thier own profile password
   *
   * @param {object}   user user object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  profileUserPassword: (user, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/users/profile/password', JSON.stringify({ user /* :user */ }), callback);
  },

  /**
   * Admin change user password
   *
   * @param {object}   user user object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  adminUserPassword: (user, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/users/password', JSON.stringify({ user /* :user */ }), callback);
  }
};

export default UserService;
