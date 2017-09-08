import Request from './request';

const LogService = {

  /**
   * Get logs
   * @param {string}   query Query string of params
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getLogs: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/logs${query}`, callback);
  }
};

export default LogService;
