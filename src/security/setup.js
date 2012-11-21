var passport = require('passport')
  //, LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , models = require('../db/models')
  ;

  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/

  // Localhost
  //var GOOGLE_CLIENT_ID = "467976947492.apps.googleusercontent.com";
  //var GOOGLE_CLIENT_SECRET = "mUgiW_akVYRSRCmgFduHXka-";

  // InstructorMatters.com
  var GOOGLE_CLIENT_ID = "467976947492-5ng5pc4f6n03p8bm0k97rmrd4ua1mqjf.apps.googleusercontent.com";
  var GOOGLE_CLIENT_SECRET = "npHd2ZC8M3_iHYzaXzkGb9Kg"; 


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Users.findOne({googleId:id}, function (err, user) {
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
    callbackURL: "/auth/google/callback"
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


updateUserData = function (dbUser, req, res) {

  if (dbUser.deleted){
    // fuerza que se actualicen los datos 
    dbUser.set({googleId:null});
  }

  if (dbUser.googleId){
    res.redirect('/instructors/' + dbUser.id);
    return;
  } 
    
  // actualizamos el token y el displayName
  async.parallel([
    function(cb){
      var query = {googleId:req.user.id, name:req.user.displayName, deleted:false};
      if (dbUser.deleted){
        query.admin=false;
        query.address=null;
        query.geopoint=null;
        query.courses=[];
        query.certificates=[];
        query.videos=[];
      }
      models.Users
      .update({_id: dbUser.id}, query )
      .exec(cb);
    }], function(err,num){
      if (err || num === 0){
        err && console.log(err.message); 
        res.send(500, 'Error updating googleId token');
        return; 
      } 
      res.redirect('/instructors/' + dbUser.id + '/edit');
      return;
  });

}

// Se ha autenticado con Google, pero ¿ está en nuestra bdd ?
passport.checkUser = function (req,res) {
  async.parallel([
    function(cb) {
      models.Users.findOne( {email:req.user.emails[0].value}).exec(cb);
    }], function( err, results){
      if (err) {
        console.log(err);
        res.send(500, err.message);
        return;
      }

      var dbUser = results[0];

      if (!dbUser){
        // creamos un usuario nuevo
        dbUser = { admin:false , certified:false,  deleted:false, courses: [], email:req.user.emails[0].value};
        models.Users.addUser(dbUser, function (err, userID) {
          if(err)  {
            console.log(err);
            res.send(500, err.message);
           return;
          }
          dbUser.id = userID;
          this.updateUserData(dbUser,req,res);
        
        });
        
      } else {
        this.updateUserData(dbUser,req,res);
        
      }
    });
}

module.exports = passport;

