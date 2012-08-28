
/**
 * Module dependencies.
 */

mongoose = require('mongoose');
  async = require('async');
  _ = require('./public/js/lib/underscore');
  UUID = require('./lib/uuid');


var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , passport = require('./security/setup')
;


  
var app = express();

  app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser()); 
  app.use(app.router);
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

//Conexión a la base de datos
mongoose.connect('mongodb://localhost/instructormatters');


routes(app);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
