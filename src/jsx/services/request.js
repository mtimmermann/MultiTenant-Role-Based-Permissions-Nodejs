import Auth from '../modules/auth';

const Request =
  (function () {

    function setHeader(xhr) {
      xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    }

    return {

      /**
       * Ajax get request
       *
       * @param {string}   url
       * @param {function} callback (err, data)
                           The function that is called after a service call
                           error {object}: null if no error
                           data {object}: The data set of a succesful call
       */
      get: (url, callback) => {
        $.ajax({
          url, // :url
          type: 'GET',
          dataType: 'json',
          beforeSend: setHeader
        }).done((result) => {
          return callback(null, result);
        }).fail((jqxhr, textStatus, error) => {
          return callback(error, jqxhr && jqxhr.responseJSON ? jqxhr.responseJSON : null);
        });
      },

      /**
       * Ajax delete request
       *
       * @param {string}   url
       * @param {function} callback (err, data)
                           The function that is called after a service call
                           error {object}: null if no error
                           data {object}: The data set of a succesful call
       */
      delete: (url, callback) => {
        $.ajax({
          url, // :url
          type: 'DELETE',
          dataType: 'json',
          beforeSend: setHeader
        }).done((result) => {
          return callback(null, result);
        }).fail((jqxhr, textStatus, error) => {
          return callback(error, jqxhr && jqxhr.responseJSON ? jqxhr.responseJSON : null);
        });
      },

      /**
       * Ajax put request
       *
       * @param {string}   url
       * @param {string}   data Stringified json data
       * @param {function} callback (err, data)
                           The function that is called after a service call
                           error {object}: null if no error
                           data {object}: The data set of a succesful call
       */
      put: (url, data, callback) => {
        $.ajax({
          url, // :url
          type: 'PUT',
          data, // :data
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          beforeSend: setHeader
        }).done((result) => {
          return callback(null, result);
        }).fail((jqxhr, textStatus, error) => {
          return callback(error, jqxhr && jqxhr.responseJSON ? jqxhr.responseJSON : null);
        });
      },

      /**
       * Ajax post request
       *
       * @param {string}   url
       * @param {string}   data Stringified json data
       * @param {function} callback (err, data)
                           The function that is called after a service call
                           error {object}: null if no error
                           data {object}: The data set of a succesful call
       */
      post: (url, data, callback) => {
        $.ajax({
          url, // :url
          type: 'POST',
          data, // :data
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          beforeSend: setHeader
        }).done((result) => {
          return callback(null, result);
        }).fail((jqxhr, textStatus, error) => {
          return callback(error, jqxhr && jqxhr.responseJSON ? jqxhr.responseJSON : null);
        });
      }
    };
  }());

export default Request;
