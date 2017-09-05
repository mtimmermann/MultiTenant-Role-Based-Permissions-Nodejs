import Request from './request';

const CompanyService = {

  /**
   * Get Companies
   *
   * @param {string}   query query string with paging options
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getCompanies: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/companies${query}`, callback);
  }
};

export default CompanyService;
