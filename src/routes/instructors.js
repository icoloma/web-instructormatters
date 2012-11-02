
var Users = require('../db/models').Users
  , services = require('../db/models').services
  , youtube  = require('../videos/youtube')
  , codeError = require('./errorHandlers').codeError;
/*
* Listado de todos los instructores
*/
exports.list =  function (req, res, next) {
  Users.findInstructors(req.params.uuid,
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
  services.getInstructorFullInfo(req.params.id, function (err, instructor) {
    if(err) return next(err);
    if(res.locals.isAdmin || res.locals.currentUser.id === req.params.id) {
      res.format({
        html: function(){
          res.render('admin/instructor', {
            title: 'instructor',
            instructor: instructor,
            courses: instructor.courses
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

    Users.updateInstructor(req.params.id, req.body, 
      function (err, num) {
        if(err) return next(err);
        res.send(204);   // OK, no content
      }
    );
  };
 



