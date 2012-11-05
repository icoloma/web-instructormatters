
var Editions = require('../db/models').Editions,
  Courses = require('../db/models').Courses,
  Users = require('../db/models').Users,
  Certificates = require('../db/models').Certificates,
  services = require('../db/models').services,
  mailSender = require('../mailer/setup'),
  codeError = require('./errorHandlers').codeError;

/*
* Mostrar una edicion (admin)
*/
exports.view = function (req, res, next) {
  Editions.findEdition(req.params.id, function (err, item) {
    if(err) return next(err);

    res.format({
      html: function () {

        async.parallel([
          function (cb) {
            // Recuperamos el curso asociado
            Courses.findCourseByUUID(item.courseUUID, cb);
          },
          function (cb) {
              getInstructors(req, cb);
          }
          ], 
          function (err, results) {
            if(err) return next(err);

            // Mostramos
            res.render('admin/edition', {
              title: 'Edition',
              edition: item,
              instructors: results[1],
              course: results[0]
            });
        });
      },
      json: function(){
        res.json(item);
      }
    }); 
  });
};

/*
* Mostrar una edicion (public)
*/
exports.showDetails = function (req, res, next) {
  Editions.findEdition(req.params.id, function (err, edition) {
    if(err) return next(err);

    res.format({
      html: function () {
        async.parallel([
          function (cb) {
            Courses.findCourseByUUID(edition.courseUUID, cb);
          },
          function (cb) {
            Users.findUser(edition.instructor, cb);
          },
          function (cb) {
            Certificates.findEditionCertificates(edition.id, cb);
          }
          ],
          function (err, results) {
            if(err) return next(err);

            res.render('public/edition', {
              title: 'Course Edition',
              edition: edition,
              course: results[0],
              instructor: results[1],
              certificates: results[2]
            });
          });

      },
      json: function () {
        res.json(edition);
      }
    });
  });

};
/*
    
*/
/*
  Añadir edición - ventana 
*/
exports.add = function (req, res, next) {
  async.parallel([
    function (cb) {
      Courses.findCourseByUUID(req.params.uuid, cb);
    },
    function (cb) {
      getInstructors(req, cb);
    }
    ],
    function (err, results) {
      if(err) return next(err);

      var defaultCourse = results[0];
      var defaultInstructor = results[1][0] ? results[1][0] : req.user;

      res.render('admin/edition', {
        title: 'Edition',
        edition: { instructor: defaultInstructor.id, courseUUID: defaultCourse.uuid},
        instructors: results[1],
        course: defaultCourse
      });
    });
};


/**
  Crear edition
*/
exports.create =  function (req, res, next) {
  if (!req.accepts('application/json')){
    res.send(406);  //  Not Acceptable
  }
  var json = req.body;
  var course = json.courseUUID;

  async.parallel([

      function (cb) {
        // Necesitamos recuperar el curso para luego redirigir mediante el uuid
        Courses.findCourseByUUID(course, cb);
      },
      function (cb) {
        Editions.saveEdition(json, cb);
      }
      ],

      function (err, results) {
        if(err) return next(err);
        var courseUUID = results[0].uuid,
          editionID = results[1];
        // Redirigimos a la URL pública
        res.header('location',  '/courses/' + courseUUID + '/editions/' + editionID);
        res.send(201);
      }
    );

};


/**
  Eliminar una edicion
*/
exports.del = function (req, res, next) {
  Editions.del(req.params.id, function (err, num) {
    if(err) return next(err);
    res.send(204);  // OK, no content
  });
};


/**
  Actualizar una edicion
*/
exports.update = function (req, res, next) {
  if (!req.accepts('application/json')){
     res.send(406, 'Not acceptable');  //  Not Acceptable
  }

  Editions.findEdition(req.params.id, function (err, edition) {
    if(err) return next(err);

    //Comprobamos que el estado es NEW, si no es así, devolver un código de error
    if(edition.state !== 'NEW') {
      return next(codeError(500, 'It\'s not allowed to modify this edition'));
    }
 
    async.parallel([
      function (cb) {
        Courses.findCourseByUUID(req.body.courseUUID, cb);
      },
      function (cb) {
        console.log("Updating " + req.body);
        Editions.updateEdition(req.params.id, req.body, cb)
      }
      ],
      function (err, results) {
        var course = results[0];
        res.header('location',  '/courses/' + course.uuid + '/editions/' + req.params.id);
        res.send(204);   // OK, no content
      }
    );
  });
};
   
/**
  Listado de las ediciones asociadas al usuario
*/
exports.list = function (req, res, next) {
  if (!req.user) {
     return next(codeError(401, 'Instructor is not logged'));
  }

  services.getEditionsFullInfo({instructor: req.user.id},
    function (err, editions) {
        if(err) return next(err);
        res.format({
          html: function () {
            res.render('admin/myeditions', {
              title: 'My editions',
              editions: editions
            });
          },
          json: function(){
            res.json(editions);
          }
      });
    });
};

/*
  Buscamos los instructores
  Si el usuario es admin, se mostrarán todos los instructores asociados al curso de la edición
  en caso contrario, solo se mostrará a el mismo
*/

var getInstructors = function (req, callback) {
  if (req.user.admin) {
    Users.findInstructors({courses: req.params.uuid}, callback);
  } else {
    // Solo le permitimos asignarse a si mismo como instructor
    callback(null, [req.user]);
  }
}

exports.sendMail = function (req, res, next) {
  console.log('Sending contact mail ' + JSON.stringify(req.body));
  mailSender.sendMail(req.body, function (err, responseStatus) {
    if(err) {
      err = codeError(500, err.message);
      return next(err);
    }
    res.send(201, responseStatus.message);      
  });
};