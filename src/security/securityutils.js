var models = require('../db/models'),
  codeError = require('../routes/errorHandlers').codeError;

/*
  Comprueba si hay un usuario logado y es administrador
*/
exports.isAdmin = function( req, res, next){
  if (req.user && req.user.admin){
    next();
  } else {
    codeError(401, 'User has not Admin permissions');
  }
}


/*
  Comprueba si el usuario tiene asignado el curso al que se intenta acceder
*/
exports.isAllowedInstructor = function(req, res, next) {
  
    if (!req.user){
      next(codeError(401, 'Instructor is not logged'));
      return;
    }

    if (req.user.admin || _.include(req.user.courses, req.params.uuid) ){
      next();
    } else {
      next(codeError(401, "You are not a certified instructor for this course"));
    }
} 


// Middleware - incluido desde  app.js

// exponemos el usuario logado como locals.currentUser
exports.exposeCurrentUser = function (req,res,next){
  res.locals.currentUser = req.user && req.user.toJSON();
  res.locals.isAdmin = req.user? req.user.admin : false;
  next();
}

// exponemos como locals.isAllowedInstructor si el usuario tiene asignado un curso ( representado por req.params.uuid)
exports.exposeIsAllowedInstructor = function (req, res, next){

    if (!req.user || !(req.user.admin || _.include(req.user.courses, req.params.uuid))) {
      res.locals.isAllowedInstructor = false;
    } else {
      res.locals.isAllowedInstructor = true;
    }
    next();
}
