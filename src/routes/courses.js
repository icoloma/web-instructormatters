var Courses = require('../db/models').Courses,
  Editions = require('../db/models').Editions,
  Videos = require('../db/models').Videos,
  services = require('../db/models').services,
  models = require('../db/models'),
  editions = require('./editions.js'),
  codeError = require('./errorHandlers').codeError,
  localizeDates = require('../db/models/helpers').localizeDates;

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
  var today = new Date();
  async.parallel([
    function (cb) {
      Courses.findCourseByUUID(req.params.uuid, cb);
    },
    function (cb) {
      var fromDate = new Date( today  - 1296000000 ); // 15*24*60*60*1000 = 15 days ago
      Editions.findCourseEditions(req.params.uuid, 10, fromDate , cb);
    },
    function (cb) {
      Videos.findCourseVideos(req.params.uuid, 3, cb);
    }
    ]
    ,
    function (err, results) {
      if(err) return next(err);

      var course = results[0],
        editions = results[1];
      _.each(editions, function(edition){
        if (new Date(edition.date) < today)
        edition.finished = true ;
      });


      localizeDates(editions);
      
      course.videos = results[2];

      res.format({
        html: function () {
          res.render('public/course', {
            title: course.name,
            course: course,
            editions: editions
          });
        },

        json: function () {
          res.json(course);
        }
      });
    }
  );
  // Courses.findCourseByUUID(req.params.uuid, function (err, item) {
  //   if(err) return next(err);
  //   var course = item;
  //   res.format({
  //       html: function () {
  //         Editions.findCourseEditions(course.uuid,
  //           function (err, editions) {
  //             services.addCourseVideos(course, 3, function (err) {
  //               res.render('public/course', {
  //                 title: course.name,
  //                 course: course,
  //                 editions: editions
  //               });
  //             });
  //         });
  //       },
  //       json: function () {
  //         res.json(course);
  //       }
  //   });
  // });
};

/*
  Listado de todos los cursos
  Mostramos una lista de vídeos por cada curso así como las siguientes ediciones
*/
exports.list =  function (req, res, next) {
  var now =  new Date();

  services.getFullCoursesList(now, 4,  function (err, editions, courses) {
    if(err) return next(err);
    async.map(courses,
      function (course, cb) {

        // Añadimos los vídeos de cada curso
        services.addCourseVideos(course, 3, function (err) {
          cb(err, course);
        });
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



