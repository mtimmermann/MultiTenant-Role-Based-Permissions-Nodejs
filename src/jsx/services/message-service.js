import Request from './request';

const MessageService = {

  /**
   * Get public message 1
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getPublicMessage1: (callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get('/api/messages/public1', callback);
  },

  /**
   * Get private message 1
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getPrivateMessage1: (callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get('/api/messages/private1', callback);
  },

  /**
   * Get admin message 1
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getAdminMessage1: (callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get('/api/messages/admin1', callback);
  }

};

export default MessageService;
