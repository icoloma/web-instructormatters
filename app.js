
/**
 * Module dependencies.
 */

  mongoose = require('mongoose');
  async = require('async');
  _ = require('./public/js/lib/underscore');


  codeError = function( status, message ) {
    var err = new Error();
    err.status = status;
    err.message = message;
    throw(err);
  };
  
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , passport = require('./security/setup')
  , security = require('./security/securityutils')
 ;


  
var app = express();

  app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser()); 
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(security.exposeCurrentUser);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Error handling
  app.use(function(err, req, res, next){
    res.status = err.status || 500;

    var page = 'public/500';
    if (res.status == 401){
      page = 'public/401';
    }

    res.render(page , { title: 'Error', error: err});
    
  });
  
  // Si ha llegado hasta aquí, es un Not Found 404
  app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('public/404', { title: 'Error', url: req.url });
      return;
    }

    res.send({ error: 'Not found' });
  });




});


//Conexión a la base de datos
mongoose.connect('mongodb://localhost/instructormatters');


routes(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
