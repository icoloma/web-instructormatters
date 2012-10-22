
var models = require('../db/models');
var mailSender = require('../mailer/setup');

/*
* Mostrar una edicion (admin)
*/
exports.view = function (req, res) {
  models.Editions.findById(req.params.id, function (err, item) {
    if(err) {
      codeError(500, err.message)
    } else if(!item || (item && item.deleted)) {
      codeError(404,'Not found');
    } else {
     
      if (item.state != "NEW") {
       codeError(500, "It's not allowed to modify this Edition");
      }
   
      res.format({
        html: function () {

          async.parallel([
            function (cb) {
              // Recuperamos el curso asociado
              models.Courses
               .findOne({uuid:item.courseUUID})
               .exec(cb)
            }, function (cb) {
                getInstructors(req,cb);
            }], function (err, results) {
              // TODO: error handling
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
    };
  });
};

/*
* Mostrar una edicion (public)
*/
exports.showDetails = function (req, res) {
  models.Editions.findById(req.params.id, function (err, item) {
    // TODO: mirar como hacer el error handlings con express 
    if(err) {
      codeError(500, err.message);
    } 
    if(!item || item.deleted) {
      codeError(404,'Not found');
    } 

    res.format({
      html: function () {
        async.parallel([
          function (cb) {
            models.Courses .findOne({uuid:item.courseUUID}) .exec(cb)
          }, function (cb) {
            models.Users .findById(item.instructor) .exec(cb)
           }, function (cb) {
            models.Certificates .find({edition:item._id}) .exec(cb)
          }], function (err, results) {
            if(err) {
              codeError(500, err.message);
            } 

            var edition = item.toJSON();
            res.render('public/edition', {
              title: 'Course Edition',
              edition: edition,
              course: results[0],
              instructor: results[1],
              certificates: results[2]
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
    
*/
/*
  Añadir edición - ventana 
*/
exports.add = function(req,res){
  async.parallel([
    function (cb) {
      models.Courses
        .findOne({deleted:false, uuid:req.params.uuid})
        .select('name uuid')
        .exec(cb)
    }, function (cb) {
      getInstructors(req, cb);
    }], function (err, results) {
      //error handling
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
  exports.create =  function (req, res) {
    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }
    var json = req.body;
    var edition = new models.Editions(json);
    var course = json.courseUUID;

    async.parallel([

        function(cb){
          // Necesitamos recuperar el curso para luego redirigir mediante el uuid
          models.Courses
            .findOne({uuid:course})
            .exec(cb);
        },

        function(cb){
          // Guardamos
          edition.save(function (err) {
            if(err) {
              codeError(500, err.message);
            } else {
              cb(err, this.emitted.complete[0]);
            }
          });
        }],

        function(err, results){
          // Redirigimos a la URL pública
          res.header('location',  '/courses/' + results[0].uuid + '/editions/' + edition.id);
          res.send(201);
        }
      );

  };


 /**
    Eliminar una edicion
  */
  exports.del = function (req, res) {
    models.Editions.update({_id: req.params.id}, {deleted: true}, function (err, num) {{
      if(err) {
        codeError(500, err.message);
      } else if(!num) {
        codeError(404,'Not found');  // not found
      } else {
        res.send(204);  // OK, no content
      }
    }});
  };


/**
  Actualizar una edicion
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406, 'Not acceptable');  //  Not Acceptable
    }
   
    //Comprobamos que el estado es NEW, si no es así, devolver un código de error
    async.parallel([
      function(cb){
        models.Editions.findById(req.params.id).exec(cb);
    }], function (err, items){
      if(err) {
        codeError(500, err.message);
      } 
      if (items[0].state != "NEW") {
        codeError(500, "It's not allowed to modify this Edition")
      }

      async.parallel([
        function(cb){
          models.Courses
              .findOne({uuid:req.body.courseUUID})
              .exec(cb);
        }, function(cb){
          console.log("updating " + req.body);
          models.Editions
            .update({_id: req.params.id}, req.body)
            .exec(cb);

        }],function(err, results){
          var course = results[0];
          var num = results[1];
          if(err) {
           codeError(500, err.message);
          } else if(!num) {
            codeError(404, 'Not found');   // not found
          } else {
            res.header('location',  '/courses/' + course.uuid + '/editions/' + req.params.id);
            res.send(204);   // OK, no content
          }

        });
    });
  };
   
  /**
    Listado de las ediciones asociadas al usuario
  */
  exports.list = function(req, res){
    if (!req.user) {
       codeError(401, 'Instructor is not logged');
    }

    var editions = getEditionsWithCourseInfo(  {deleted:false, instructor: req.user.id}
      , function( err, editions){
          if(err) {
            console.log(err);
            throw err;
          }
          res.format({
            html: function(){
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

var getInstructors = function(req , callback){
  if (req.user.admin){
    models.Users
      .find({  
          deleted:false
        , courses: req.params.uuid})
      .select('name') 
      .sort('name','ascending')
      .exec(callback)
  } else {
    // Solo le permitimos asignarse a si mismo como instructor
    callback(null, [req.user]);
  }
}


exports.sendMail = function(req, res) {
  console.log('Sending contact mail ' + JSON.stringify(req.body));
  mailSender.sendMail(req.body, function(error, responseStatus) {
    if (!error) {
      res.send(201, responseStatus.message);      
    } else {
      codeError(500, error.message);
    }
  });
};  


/*
  Retornamos las ediciones junto con el nombre del curso
*/
var getEditionsWithCourseInfo = function( query, callback ){
  async.parallel([
      function(cb){

        models.Editions
         .find( query )
         .sort('date','ascending')
         .exec(cb);
      },
      function(cb){
        models.Courses
          .find( {deleted:false })
          .select( "name description uuid")
          .exec(cb)    
      }], function(err, items){
        if(err) {
          console.log(err);
          callback(err,items)
          return;
        }

        var editions = items[0]
          , courses = items[1]
          , coursesMap = {}

        courses.forEach(function(course) {
          coursesMap[course.uuid] = {name: course.name, description: course.description};
        })

        _.each( editions, function(edition){ 
          edition.course = coursesMap[edition.courseUUID]; 
        });
        callback( null, editions);
      });

  };

  exports.getEditionsWithCourseInfo = getEditionsWithCourseInfo;