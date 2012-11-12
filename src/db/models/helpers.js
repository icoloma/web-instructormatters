var codeError = require('../../routes/errorHandlers.js').codeError;


module.exports = {
  wrapResult: function (callback) {
    return function (err, result) {
      if(err) {
        err = codeError(500, err.message);
      } else if(!result || result.length === 0 || result.deleted) {
        err = codeError(404, 'Not found');
      } else {
        if(result.map) {
          result = result.map(function (item) {
            return item.toJSON();
          });
        } else {
          if(result.toJSON) {
            result = result.toJSON();
          }
        }
      }

      callback(err, result);
    }
  },
}