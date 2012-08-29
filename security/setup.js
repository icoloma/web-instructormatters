var passport = require('passport')
  //, LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , models = require('../db/models')
  ;

  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/
  var GOOGLE_CLIENT_ID = "467976947492.apps.googleusercontent.com";
  var GOOGLE_CLIENT_SECRET = "mUgiW_akVYRSRCmgFduHXka-";


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Users.findOne({oauth:id}, function (err, user) {
    done(err, user);
  });
});




// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));



//  exponemos el usuario logado 
passport.currentUser = function (req,res,next){
  res.locals.currentUser = req.user;
  next();

}


// Se ha autenticado con Google, pero ¿ está en nuestra bdd ?
passport.checkUser = function (req,res) {
  async.parallel([
    function(cb) {
      models.Users.findOne( {email:req.user.emails[0].value, deleted:false}).exec(cb);
    }], function( err, results){
      if (err) {
        console.log(err);
        res.send(500, err.message);
        return;
      }
     
      var dbUser = results[0];
      if (!dbUser){
        req.logOut();
        res.send(404);
        return;
      }

      if (dbUser.oauth){
        res.redirect('/');
        return;
      } 
      
      // actualizamos el token
      async.parallel([
        function(cb){
          models.Users
          .update({_id: dbUser.id}, {oauth:req.user.id, name:req.user.displayName})
          .exec(cb);
        }], function(err,num){
          if (err || num === 0){
            err && console.log(err.message); 
            res.send(500, 'Error updating oauth token');
            return; 
          } 
           
          res.redirect('/');
        });
    });
}

module.exports = passport;

