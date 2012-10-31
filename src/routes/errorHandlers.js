
module.exports = {

  // 401, 500 error handling
  err: function(err, req, res, next) {
    res.statusCode = err.status || 500;

    var page = 'error/' + ([ 401, 404, 500 ].indexOf(err.status) > -1 ? err.status : 500);
    var title = err.message || (err.status == 404? 'Not found' : 'Internal error');
    if (req.accepts('html')) {
      res.render(page , { title: title, error: err});
    } else {
      res.json({ error: err.message }); //Queremos mandar el error?
    }
  },

  // 404 handler
  notFound: function(req, res, next) {
    codeError(404);
  }

}