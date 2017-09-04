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
  }

};

export default Auth;
