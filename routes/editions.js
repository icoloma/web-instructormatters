
var models = require('../db/models');

/*
  Buscamos los instructores
  Si el usuario es admin, se mostrarán todos los instructores asociados al curso de la edición
  en caso contrario, solo se mostrará a el mismo
*/

var getInstructors = function(req , callback){

  if (req.user.admin){
    // TOOD : Buscar solo los instructores asignados al curso
    models.Users
      .find({deleted:false})
      .select('name') 
      .sort('name','ascending')
      .exec(callback)
  } else {
    // Solo le permitimos asignarse a si mismo como instructor
    callback(null, [req.user]);
  }


}


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
     
      if (item.state != "NEW") {
        res.send(500, "It's not allowed to modify this Edition")
        return;
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
      res.send(500, err.message)
      return;
    } 
    if(!item || item.deleted) {
      res.send(404);
      return;
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
              res.send(500, err.message)
              return;
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
      var defaultInstructor = results[1][0];
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
              console.log(err);
              res.send(500, err.message);
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
   
    //Comprobamos que el estado es NEW, si no es así, devolver un código de error
    async.parallel([
      function(cb){
        models.Editions.findById(req.params.id).exec(cb);
    }], function (err, items){
      if(err) {
        console.log(err);
        res.send(500, err.message);
        return;
      } 
      if (items[0].state != "NEW") {
        res.send(500, "It's not allowed to modify this Edition")
        return;
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
            console.log(err);
            res.send(500, err.message);
          } else if(!num) {
            res.send(404);   // not found
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
      res.send(401);
      return;
    }

    async.parallel([
      function(cb){
        models.Editions
             .find( {deleted:false, instructor: req.user.id})
             .sort('date','descending')
             .exec(cb);
      }], function(err, items){
        if(err) {
          console.log(err);
          res.send(500, err.message);
          return;
        }
        res.format({
          html: function(){
            res.render('admin/myeditions', {
              title: 'My editions',
              editions: items[0]
            });
          },
          json: function(){
            res.json(items);
          }
        });
      });
  };

      
    

