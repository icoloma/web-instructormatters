
var Users = require('../db/models').Users
  , Courses = require('../db/models').Courses
  , services = require('../db/models').services
  , youtube  = require('../videos/youtube')
  , codeError = require('./errorHandlers').codeError
  , wrapResult = require('../db/models/helpers').wrapResult;

/*
* Listado de todos los instructores
*/
exports.list =  function (req, res, next) {
  var query = {  address : { $exists : true }, deleted: false };
  if (req.params.uuid){
    query.courses = req.params.uuid;
  }
  Users.findInstructors(query,
      function (err, items) {
        if(err) return next(err);
        res.format({
          html: function () {
            var json = JSON.stringify(items);
            res.render('public/instructors', {
              title: 'Instructors',
              instructors: items,
              json: json
            });
          },
          json: function () {
            res.json(items);
          }
        });
      }
    )
  };


/*
  Información pública del instructor
*/
exports.show =  function (req, res, next) {
  services.getInstructorFullInfo(req.params.id, function (err, instructor) {
    if(err) return next(err);
    instructor = _.omit(instructor, ['admin', 'expires'])
    res.format({
      html: function(){
        res.render('public/instructor', {
          title: instructor.name,
          instructor: instructor,
          geolocation: instructor.geopoint.lat + ',' +  instructor.geopoint.lng + '&z=' + instructor.geopoint.zoom
        });
      },
      json: function(){
        res.json(instructor); 
      }
    });
  });
};




/*
* Información para editar el instructor
*/
exports.view =  function (req, res, next) {

  async.parallel([
    function(callback){
      Courses.findAllCourses(function (err, courses) {
        if(err) return next(err);
        callback(err,courses);
        });
      }
    ,
    function(callback){
      Users.findOne({deleted: false, _id: req.params.id},  wrapResult(function (err, instructor) { 
        callback(err,instructor);
      }));
      //services.getInstructorFullInfo(req.params.id, callback);
    }
    ], function(error,results){
      if(error) return next(err);
      if(res.locals.isAdmin || res.locals.currentUser.id === req.params.id) {
        res.format({
          html: function(){
            res.render('admin/instructor', {
              title: 'instructor',
              instructor: results[1],
              courses: results[0]
            });
          },
          json: function(){
            res.json(instructor);
          }
        });
      }
    });
};


/**
  Actualizar un instructor
*/
  exports.update = function (req, res, next) {
    if (!req.accepts('application/json')) {
       next(codeError(406,'Not acceptable'));
       return;
    }

    // evitamos que nos inyecten estas propiedades
    delete req.body.admin;
    delete req.body.certified;

    Users.updateInstructor(req.params.id, req.body, 
      function (err, num) {
        if(err) return next(err);
        res.send(204);   // OK, no content
      }
    );
  };
 

 exports.del = function (req, res, next) {
  Users.deleteUser(req.user.id, function (err, num) {
    if(err) return next(err);
    req.logOut();
    res.format({
          html: function(){
            res.redirect('/');
            return;
          },
          json: function(){
            res.send(204);  // OK, no content
            return;
          }
    });
  });
}




