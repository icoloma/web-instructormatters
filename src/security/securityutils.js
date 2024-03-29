var models = require('../db/models'),
  helpers = require('../db/models/helpers'),
  codeError = require('../routes/errorHandlers').codeError;

/*
  Comprueba si hay un usuario logado y es administrador
*/
exports.isAdmin = function( req, res, next){
  if (req.user && req.user.admin){
    next();
  } else {
    var username= 'guest';
    if (req.user){
      username = req.user.email;  
    }
    console.log(username + " tried to perform an Admin operation");
    next(codeError(401, 'User has not Admin permissions'));
  }
}


/*
  Comprueba si tienes acceso al perfil
*/
exports.isHimself = function(req, res, next) {
  
    if (!req.user){
      next(codeError(401, 'Instructor is not logged'));
      return;
    }

    if (req.user.admin ||  (req.user.id === req.params.idInstructor)){
      next();
    } else {
      console.log(req.user.email + " tried to access another instructor '" + req.params.idInstructor + "'");
      next(codeError(401, "You are not allowed to modify other instructor's profile"));
    }
}  


/*
  Comprueba si el instructor tiene certificación en el curso
*/
exports.isCertifiedInstructor = function(req, res, next) {
  
    if (!req.user){
      next(codeError(401, 'Instructor is not logged'));
      return;
    }

    if (req.user.admin ||  helpers.isCertified(req.user, req.params.uuid)){
      next();
    } else {
      console.log(req.user.email + " tried to access as Certified instructor for course '" + req.params.uuid + "'");
      next(codeError(401, "You are not a certified instructor for this course"));
    }
}  

exports.isEditionOwner = function(req, res, next) {
  if (!req.user){
    next(codeError(401, 'Instructor is not logged'));
    return;
  }

  if (!req.params.idEdition || req.user.admin ){
    next();
    return;
  }

  models.Editions.findEdition(req.params.idEdition, function(err,edition){
    if(err) {
      next(err);
      return;
    }
    var isOwner = req.user.id === edition.instructorId;
    if (!isOwner){
       console.log(req.user.email + " tried to access as owner for edition '" + req.params.idEdition + "'");
      next(codeError(401, "You are not the owner of this edition"));
      return;
    }
    next();
  });
}  


// Middleware - incluido desde  app.js

// exponemos el usuario logado como locals.currentUser
exports.exposeCurrentUser = function (req,res,next){
  res.locals.currentUser = req.user && req.user.toJSON();
  res.locals.isAdmin = req.user? req.user.admin : false;
  next();
}


// exponemos instructor:
//  locals.isAllowedInstructor si el usuario tiene asignado un curso ( representado por req.params.uuid)
//  locals.isCertifiedInstructor si está certificado en el.
exports.exposeInstructor = function (req, res, next){

    // is Assigned 
    if (!req.user || !(req.user.admin || _.include(req.user.courses, req.params.uuid))) {
      res.locals.isAllowedInstructor = false;
    } else {
      res.locals.isAllowedInstructor = true;
    }

    // is Certified
    if (!req.user || !(req.user.admin ||  helpers.isCertified(req.user, req.params.uuid))) {
      res.locals.isCertifiedInstructor = false;
    } else {
      res.locals.isCertifiedInstructor = true;
    }


    // Is the edition Owner ?
    if (!req.params.idEdition || !req.user){
      next();
      return;
    }

    if (req.user.admin){
      res.locals.isEditionOwner =true;
      next();
      return;
    }

    models.Editions.findEdition(req.params.idEdition, function(err,edition){
      if(err) {
        next(err);
        return;
      }
      res.locals.isEditionOwner = req.user.id === edition.instructorId.toString();
      next();
    });
  
 }

 // comprobamos que el dominio sea "instructormatters.com"
exports.checkDomain = function (req,res,next){
  var host =req.headers.host
  if (host.indexOf("localhost") != -1) {
    next();
    return;
  }
  if (host.indexOf(":") != -1) {
     host = /(.*):.*/.exec(host)[1];
  }
  if (host != "instructormatters.com" && host != 'instructormatters.nodejitsu.com') {
    res.redirect("http://instructormatters.com");
  }
   next();
}

