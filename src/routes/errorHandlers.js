
Error.prototype.toErrorMessage = function () {
  var log = "";

  _.each(this, function (value, prop) {
    if(prop !== 'stack') {
      log = log + "  " + prop + ": " + (value && value.toString()) + ",\n";
    }
  });

  return "{\n" + log + "}";
}

var codeError = function (status, message) {
  var err = new Error();
  err.message = message;
  err.status = status;
  return err;
};

module.exports = {

  // 401, 500 error handling middleware
  err: function(err, req, res, next) {
    res.statusCode = err.status || 500;

    if(err.status === 500) {
      //Volcado para el log
      console.log(err.stack);
      console.log(err.toErrorMessage());
    }

    err = _.pick(err, ['status', 'message']);

    var page = 'error/' + ([ 401, 404, 500 ].indexOf(err.status) > -1 ? err.status : 500);
    var title = err.message || (err.status == 404? 'Not found' : 'Internal error');

    res.format({
      html: function () {
         res.render(page , { title: title, error: err});
      },

      json: function(){
        res.json(err.message); //Queremos mandar el error?
      }
    });
  },

  // 404 handler
  notFound: function(req, res, next) {
    next(codeError(404));
  },

  codeError: codeError,

  internalErrorHandler:  function (err) {
    if(err) {
      //ECMA5 Beware, for human eyes should not behold this
      ["stack", "type", "arguments", "message"].forEach(function (prop) {
        Object.defineProperty(err, prop, {enumerable: true});
      });

      err.internalMessage = err.message;
      err.message = 'Internal server error';
      err.status = 500;
    }
    return err;
  },

  resultsErrorHandler: function (result) {
    if(!result || result.length === 0 || result.deleted) {
      return codeError(404, 'Not found');
    }
    else {
      return null;
    }
  },
}