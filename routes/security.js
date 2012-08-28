


var passport = require('../security/setup');

/*
  Mostrar Formulario de Login
*/
exports.show = function (req, res) {
  res.render('public/login', {
            title: 'Login',
            user: {}
          });
}


/*
  Procesar petición de logout
*/
exports.logout = function (req, res) {
  req.logOut();
  res.redirect('/');
}


/*
  Procesar petición de login
*/
exports.login = function(req, res, next){
   passport.authenticate('local', function(err, user, info) {
    if (err) { 
      console.log(err);
      return next(err); 
    }
    if (!user) { 
      console.log("User not found");
      return res.redirect('/login');
     }

    req.logIn(user, function(err) {
      if (err) {
        console.log(err); 
        return next(err); 
      }
      return res.redirect('/users/' + user.id);
    });
  })(req, res, next);

}


