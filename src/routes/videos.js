
var Videos = require('../db/models').Videos
  , services = require('../db/models').services
  , codeError = require('./errorHandlers').codeError;


exports.list = function (req, res, next) {
  Videos.findInstructorVideos(req.params.idInstructor, function (err, items) {
    if(err) return next(err);
    res.send(items);
  });
};

exports.update = function (req, res, next) {
  if (!req.accepts('application/json')){
    res.send(406);  //  Not Acceptable
  }
  
  Videos.updateInstructorVideos(req.params.idInstructor, req.body, function (err) {
    if(err) return next(err);
    res.header('location',  '/instructors/' + req.params.idInstructor + '/edit' );
    res.send(201);
  })

};

exports.del = function (req, res, next) {
  Videos.deleteVideo(req.params.idVideo, function (err) {
    if(err) return next(err);
    
    res.send(204);
  });
}