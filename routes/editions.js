
var models = require('../db/models');



/*
  Listado de todas las ediciones

exports.list =  function (req, res) {
  models.Editions
    .find({deleted: false})
    .sort('date','ascending')
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){

              // hay que añadirle el nombre de los instructores
              async.parallel(
                [function (cb) {
                  // Recuperamos los instructores que aparecen en las ediciones
                  var instructorIds = _.uniq(_.map(items, function(item) {return item.instructor.toJSON();}));
                  models.Users
                    .find({ _id : { $in : instructorIds } })
                    .select('name')
                    .exec(cb);  
                },
                function (cb) {
                  // Recuperamos los cursos que aparecen en las ediciones
                  var coursesIds = _.uniq(_.map(items, function(item) {return item.course.toJSON();}));
                  models.Courses
                    .find({ _id : { $in : coursesIds } })
                    .select('name')
                    .exec(cb);  
                }],
                function (err, results) {
                  res.render('admin/editions', {
                    title: 'Editions',
                    editions: items,
                    instructors: results[0],
                    courses: results[1]
                  });
                });
            },
            json: function(){
              res.json(items);
            }
          });
        };
      }
    )
};
*/

/*
* Mostrar una edicion (admin)
*/
exports.view = function (req, res) {
  models.Editions.findById(req.params.id, function (err, item) {
    if(err) {
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function () {

          async.parallel([
            function (cb) {
              // Recuperamos el curso asociado
              models.Courses
               .findById(item.course)
               .exec(cb)
            }, function (cb) {
              // Recuperamos todos los instructores
              models.Users
                .find({deleted: false})
                .select('name') 
                .sort('name','ascending')
                .exec(cb)
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
    if(err) {
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function () {
          async.parallel([
            function (cb) {
              // recuperamos el curso asociado
              models.Courses
                .findById(item.course)
                .exec(cb)
            }, function (cb) {
              // recuperamos el instructor
              models.Users
                .findById(item.instructor)
                .exec(cb)
            }], function (err, results) {
              // Mostramos 
              // TODO: error handling
              if (err){
                console.log(err);
                res.send(500,err.message);
              } else {
                var edition = item.toJSON();
                res.render('public/edition', {
                  title: 'Course Edition',
                  edition: edition,
                  course: results[0],
                  instructor: results[1]
                });
              }
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
  Añadir edición - ventana 
*/
exports.add = function(req,res){
  console.log("foo");
  async.parallel([
    function (cb) {
      models.Courses
        .find({deleted:false, _id:req.params.idCourse})
        .select('name')
        .exec(cb)
    }, function (cb) {
      models.Users
        .find({deleted: false})
        .select('name') 
        .sort('name','ascending')
        .exec(cb)
    }], function (err, results) {
      //error handling
      var defaultCourse = results[0][0];
      var defaultInstructor = results[1][0];
      res.render('admin/edition', {
        title: 'Edition',
        edition: { instructor: defaultInstructor.id, course: defaultCourse.id},
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
    var certificates = json.certificates;
    delete json.certificates;
    var edition = new models.Editions(json);

    async.parallel([

        function(cb){
          // Necesitamos recuperar el curso para luego redirigir mediante el uuid
          models.Courses
            .findById(edition.course)
            .exec(cb);
        },

        function(cb){
          // Guardamos
          edition.save(function (err) {
            if(err) {
              console.log(err);
              res.send(500, err.message);
            } else {
              cb(err, this.emitted.complete[0]);
            }
          });
        }],

        function(err, results){
          // Redirigimos a la URL pública
          var course = results[0];
          var edition = results[1];
          res.header('location',  '/courses/' + course.uuid + '/editions/' + edition.id);
          res.send(201);
        }
      );


/*
        for (i in certificates) {
          var certificate = new models.Certificates(certificates[i]);
          certificate.edition = edition._id;
          certificate.uuid=  UUID.genV4();
          certificate.save(function (err) {
            if(err) {
              console.log(err);
              
            } 
          });
        }
*/  

  };


 /**
    Eliminar una edicion
  */
  exports.del = function (req, res) {
    models.Editions.update({_id: req.params.id}, {deleted: true}, function (err, num) {{
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);  // not found
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
       res.send(406);  //  Not Acceptable
    }
   
    async.parallel([
      function(cb){
        models.Courses
            .findById(req.params.idCourse)
            .exec(cb);
      }, function(cb){
        models.Editions
          .update({_id: req.params.id}, req.body)
          .exec(cb);

      }],function(err, results){
        var course = results[0];
        var num = results[1];
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else if(!num) {
          res.send(404);   // not found
        } else {
          res.header('location',  '/courses/' + course.uuid + '/editions/' + req.params.id);
          res.send(204);   // OK, no content
        }

      });
   
      
    
  };

