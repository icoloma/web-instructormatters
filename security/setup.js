var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , models = require('../db/models')
  ;


module.exports = passport;

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.Users.findOne({ name: username }, function(err, user) {
      if (err) { return done(err);e }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }

      /*

      TODO: check for valid password 
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      */
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Users.findOne({_id:id}, function (err, user) {
    done(err, user);
  });
});



