const Company = require('mongoose').model('Company');

module.exports = {

  /**
   * Initialize app.locals with an array of subdomain names from db
   *
   * @param {object} app The app instance
   */
  init: (app) => {
    app.locals.subdomains = [];

    Company.find({}, (err, results) => {
      if (err) console.log(err);
      else if (results) {
        app.locals.subdomains = [];
        results.forEach((item) => {
          app.locals.subdomains.push(item.subdomain.toLowerCase());
        });
      }
    });
  },

  /**
   * Add a company subdomain name to the list
   *
   * @param {object} app The app instance
   * @param {string} subdomain Name of the subdomain
   */
  add: (app, subdomain) => {
    subdomain = subdomain.toLowerCase();
    if (app.locals.subdomains.indexOf(subdomain) < 0) {
      app.locals.subdomains.push(subdomain);
    }
  },

  /**
   * Map a subdomain from an array list of subdomains from req.subdomains
   *
   * @param   {object} app The app instance
   * @param   {array}  subdomains A list of subdomains
   * @returns {string} The matched subdomain, null if not found
   */
  match: (app, subdomains) => {
    const list = app.locals.subdomains;
    if (subdomains.length === 1) {
      const idx = list.indexOf(subdomains[0]);
      return idx > -1 ? list[idx] : null;
    }
    if (subdomains.length === 0) {
      return null;
    } else if (subdomains.length > 1) {
      subdomains = subdomains.reverse();
      const idx = list.indexOf(subdomains[0]);
      return idx > -1 ? list[idx] : null;
    }

  }
};
