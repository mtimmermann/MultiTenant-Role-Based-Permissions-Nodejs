import CompanyService from '../services/company-service';
import { session } from '../config';

function isExpired() {
  const exp = parseInt(localStorage.getItem('exp')); // eslint-disable-line radix
  return Date.now() > exp;
}

function setExpire() {
  const exp = new Date().getTime() + session.maxAge;
  localStorage.setItem('exp', new Date(exp).getTime());
}

const Auth = {

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  isAuthenticated: () => {
    if (localStorage.getItem('token') !== null && !isExpired()) {
      setExpire();
      return true;
    }

    Auth.deauthenticateUser(); // On expire, de-auth user
    return false;
  },

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   * @param {object} user
   */
  authenticateUser: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('utoken', btoa(JSON.stringify(user)));
    setExpire();
  },

  /**
   * Update user in local Storage
   *
   * @param {object} user
   */
  updateUser: (user) => {
    localStorage.setItem('utoken', btoa(JSON.stringify(user)));
  },

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   */
  deauthenticateUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utoken');
    localStorage.removeItem('exp');
    localStorage.removeItem('ctoken');
  },

  /**
   * Get a token value.
   * @returns {string}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Get user role
   * @returns {string}
   */
  getRole: () => {
    const user = Auth.getUser();
    return user && user.role ? user.role : '';
  },

  /**
   * Get user object
   * @returns {object}
   */
  getUser: () => {
    const utoken = localStorage.getItem('utoken');
    return utoken !== null ? JSON.parse(atob(utoken)) : null;
  },

  /**
   * Get Company ojbect { name & subdomain }
   * @param {function} callback (err, data)
                       The function that is called after the async call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getCompany: (callback) => { // eslint-disable-line consistent-return
    const ctoken = localStorage.getItem('ctoken');
    if (ctoken === null) {
      const locParts = window.location.hostname.split('.');
      if (locParts.length === 3) {
        const subdomain = locParts[0].toLowerCase();
        CompanyService.getCompanyBySubdomain(subdomain, (err, result) => {
          if (err) { return callback(err); }

          const company = { name: result.data.name, subdomain: result.data.subdomain };
          localStorage.setItem('ctoken', btoa(JSON.stringify(company)));
          return callback(null, company);
        });
      } else { return callback(null, null); }
    } else {
      return callback(null, JSON.parse(atob(ctoken)));
    }
  }

};

export default Auth;
