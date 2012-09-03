var models = require('../db/models');

/*
  Comprueba si hay un usuario logado y es administrador
*/
exports.isAdmin = function( req, res, next){
  if (req.user && req.user.admin){
    next();
  } else {
    res.send(401);  // forbidden
  }
}


/*
  Comprueba si el usuario tiene asignado el curso al que se intenta acceder
*/
exports.isAllowedInstructor = function( req, res, next) {
  
    if (!req.user){
      res.send(401);
      return;
    }

    if (req.user.admin || _.include(req.user.courses, req.params.uuid) ){
      next();
    } else {
      res.send(401, "You are not a certified instructor for this course");
    }
} 


// Middleware - incluido desde  app.js

// exponemos el usuario logado como locals.currentUser
exports.exposeCurrentUser = function (req,res,next){
  res.locals.currentUser = req.user;
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
