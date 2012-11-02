var Courses = require('../db/models').Courses,
  Editions = require('../db/models').Editions,
  services = require('../db/models').services,
  models = require('../db/models'),
  editions = require('./editions.js'),
  codeError = require('./errorHandlers').codeError;

/*
  Mostrar un curso (edicion)
*/
exports.view = function (req, res, next) {

  Courses.findCourseByUUID(req.params.uuid, function (err, item) {
    if(err) return next(err);

    var course = item;
    res.format({
        html: function(){
          res.render('admin/course', {
            title: 'Course',
            course: course
          });
        },
        json: function(){
          res.json(course);
        }
    });
  });
}

/*
  Mostrar un curso (public)
*/
exports.showDetails = function (req, res, next) {
  Courses.findCourseByUUID(req.params.uuid, function (err, item) {
    if(err) return next(err);
    var course = item;
    res.format({
        html: function () {
          Editions.findCourseEditions(course.uuid,
            function (err, editions) {
              services.addCourseVideos(course, 100, 3, function (err,items) {
                res.render('public/course', {
                  title: course.name,
                  course: course,
                  editions: editions
                });
              });
          });
        },
        json: function () {
          res.json(course);
        }
    });
  });
};

/*
  Listado de todos los cursos
  Mostramos una lista de vídeos por cada curso así como las siguientes ediciones
*/
exports.list =  function (req, res, next) {
  var now =  /(.+)T.+/.exec(new Date().toISOString());

  services.getFullCoursesList(now, function (err, editions, courses) {
    if(err) return next(err);
    async.map(courses,
      function (course, cb) {

        // Añadimos los vídeos de cada curso
        services.addCourseVideos(course, 3, 1, cb);
      },
      function (err, coursesWithVideos) {

        // Mostramos como máximo 3 vídeos de diferentes instructores
        res.render('public/courses', {
          title: 'Courses',
          courses: coursesWithVideos,
          editions: editions
        });

      }
    );
  });
};

var filterVideoCourses = function (courses) {

}

/*
  Añadir curso - ventana 
*/
exports.add = function(req,res){
  res.render('admin/course', {
      title: 'New Course ',
      course: {}
    });
}


/**
  Crear/Actualizar un curso
  Hack: backbone siempre interpretará las inserciones como actualizaciones  (simpre existe uuid) y por tanto
  siempre hará un PUT a /courses/:uuid. 
  Hay que distinguir en el lado servidor cuando es inserción y cuando actualización
*/
  exports.save = function (req, res, next) {
    if (!req.accepts('application/json')) {
      next(codeError(406, 'Not acceptable'));
      return; //Necesario?
    }

    var json = req.body,
      uuid = req.params.uuid;

    //Check sanitario de la uuid en el json
    if(json.uuid !== uuid) {
      next(codeError(400, 'Bad request'));
      return; 
    }

    // var course = new Courses(json);
    Courses.putCourse(json, uuid, function (err, insertion) {
      if(err) return next(err);
      if(insertion) {
        res.header('location',  '/courses/'+ json.uuid );
        res.send(201);
      } else {
        res.send(204);   // OK, no content
      }
    });
  }

  /**
    Eliminar un curso
  */
  exports.del = function (req, res, next) {
    Courses.del(req.params.uuid, function (err) {
      if(err) return next(err);
      res.send(204);  // OK, no content
    });
  };



