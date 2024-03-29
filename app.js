
/**
 * Module dependencies.
 */

  mongoose = require('mongoose');
  async = require('async');
  _ = require('underscore');

  __apppath = __dirname;
  
var express = require('express')
  , http = require('http')
  , path = require('path')
  , moment = require('moment')
  , routes = require('./src/routes')
  , passport = require('./src/security/setup')
  , security = require('./src/security/securityutils')
  , errorHandlers = require('./src/routes/errorHandlers')
  , cronUtils = require('./src/cron/cronutils')
 ;

var app = express();
app.configure(function() {

  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.cookieParser()); 
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(security.checkDomain);
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(security.exposeCurrentUser);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(errorHandlers.notFound);
  app.use(errorHandlers.err);

  // jade helpers
  app.locals({
    isoLangs: require('./src/lib/isolangs').isoLangs,
    fromNow: function(date) {
      var time = moment(date).fromNow();

      return time.charAt(0).toUpperCase() + time.slice(1);
    }
  });

});

mongoose.connect('mongodb://nodejitsu_extrema:cv4evebpbhiurtg4g3ab3av32v@ds051947.mongolab.com:51947/nodejitsu_extrema_nodejitsudb302180454');
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


cronUtils.updateRankings();
