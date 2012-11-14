
var codeError = function (status, message) {
  var err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

module.exports = {

  // 401, 500 error handling
  err: function(err, req, res, next) {
    res.statusCode = err.status || 500;

    var page = 'error/' + ([ 401, 404, 500 ].indexOf(err.status) > -1 ? err.status : 500);
    var title = err.message || (err.status == 404? 'Not found' : 'Internal error');
    console.log( res.statusCode + " : " + title);

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

  codeError: codeError
}