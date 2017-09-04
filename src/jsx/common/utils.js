/* eslint-disable wrap-iife */
/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */

const Utils =
(function () {

  return {

    /**
     * Alternative to setTimeout, will execute callback in true time based on a timestamp;
     * as some browsers timing varies w/ setTimeout
     * @param {number} interval Time to wait in milliseconds
     * @param {function} callback() The callback function
     */
    timeout: (interval, callback) => {
      const start = Date.now();
      (function f() {
        // eslint-disable-next-line one-var
        // eslint-disable-next-line indent
        const diff = Date.now() - start;
        // const ns = (((interval - diff)/1e3) >> 0);
        // const m = (ns/60) >> 0;
        // const s = ns - m*60;
        // console.log('Callback in '+ m +':'+ ((''+s).length>1?'':'0')+s);
        if (diff > interval) {
          callback();
          return void 0; // eslint-disable-line no-void
        }
        // setTimeout(f,1e3);
        setTimeout(f, 10); // Pass the function in to window.setTimeout
      })();
    },

    /**
     * Find the first input to set focus to
     */
    focusFirstInput: () => {
      $('form:first *:input[type!=hidden]:enabled:first').focus();
    }
  };

}());

export default Utils;
