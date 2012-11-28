 
var Videos = require('../db/models').Videos
  , Users  = require('../db/models/').Users
  , services = require('../db/models').services
  , codeError = require('./errorHandlers').codeError;


exports.list = function (req, res, next) {
  Videos.findInstructorVideos(req.params.idInstructor, function (err, items) {
    if(err) return next(err);
    res.send(items);
  });
};

exports.del = function (req, res, next) {

  var idInstructor = req.params.idInstructor;

  async.parallel([
    function(cb){
      Videos.findById( req.params.idVideo, cb);      
    },
    function(cb){
      Users.findUser(req.params.idInstructor,cb);
    }],
    function(err, items){
      if (err){ return next(err)};
      var video = items[0];
      var instructor = items[1];
      var ranking = instructor.ranking -  video.ranking.value;

      Videos.deleteVideo( video.id, function(err){
        if (err) {return next(err)};
        Users.updateInstructor(instructor.id, {ranking: ranking}, function(err,num){
          if (err) {return next(err)};
          return res.send(204);
        });

      });

    
    });

  ;

};
  
