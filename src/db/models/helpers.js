var codeError = require('../../routes/errorHandlers.js').codeError;


var jsonResult = function (result) {
  if(result.map) {
    return result.map(function (item) {
      return item.toJSON();
    });
  } else if(result.toJSON) {
    return result.toJSON();
  }
};

module.exports = {
  wrapResult: function (callback) {
    return function (err, result) {
      if(err) {
        err = codeError(500, err.message);
      } else if(!result || result.length === 0 || result.deleted) {
        err = codeError(404, 'Not found');
      } else {
        result = jsonResult(result);
      }
      callback(err, result);
    }
  },

  jsonResult: function (callback) {
    return function (err, result) {
      callback(err, jsonResult(result));
    }
  },
}