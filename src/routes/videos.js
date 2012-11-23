
var Videos = require('../db/models').Videos
  , services = require('../db/models').services
  , codeError = require('./errorHandlers').codeError;


exports.list = function (req, res, next) {
  Videos.findInstructorVideos(req.params.idInstructor, function (err, items) {
    if(err) return next(err);
    res.send(items);
  });
};

exports.del = function (req, res, next) {
  Videos.deleteVideo(req.params.idVideo, function (err) {
    if(err) return next(err);
    
    res.send(204);
  });
}