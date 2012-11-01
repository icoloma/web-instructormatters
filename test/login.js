
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Users = require('../src/db/models').Users;


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));

module.exports = function (server) {

  server.get('/login/:user', function (req, res, next) {
    var oauth = req.params.user.match(/oauth=([^&]+)/)[1],
      email = req.params.user.match(/email=([^&]+)/)[1];
    req.user = {
      id: oauth,
      emails: [{value: email}]
    };
    next();
  }, 
  function() {

  }, passport.checkUser);

}