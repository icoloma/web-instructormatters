
module.exports = {

  // 401, 500 error handling
  err: function(err, req, res, next) {
    res.status = err.status || 500;
    var page = 'error/' + [ 400, 401, 500 ].indexOf(res.status)? res.status : 500;
    var title = err.message || (res.status == 404? 'Not found' : 'Internal error');
    if (req.accepts('html')) {
      res.render(page , { title: title, error: err});
    } else {
      res.send({ error: title });
    }
  },

  // 404 handler
  notFound: function(req, res, next) {
    codeError(404);
  }

}