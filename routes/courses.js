
var models = require('../db/models');


/*
  Mostrar un curso (edicion)
*/
exports.view = function (req, res) {
  models.Courses
  .findById(req.params.id)
  .exec(function (err, item) {
    if(err) {
      console.log(err);
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function(){
          res.render('admin/course', {
            title: 'Course',
            course: item
          });
        },
        json: function(){
          res.json(item);
        }
      });
    };
  });
}



/*
  Mostrar un curso (public)
*/
exports.showDetails = function (req, res) {
  findCourseByUUID(req.params.uuid, res, function(items){
    var course = items[0];
    res.format({
            html: function(){
               async.parallel(
                [function (cb) {
                   models.Editions
                    .find({deleted: false, course:course.id})
                    .sort('date','ascending')
                    .exec(cb);
                }],
               function( err, results){
                  var editions = results[0];
                  res.render('public/course', {
                    title: 'Course',
                    course: course,
                    editions: editions
                  });
                }
              );
            },
            json: function(){
              res.json(course);
            }
          });
  });
};

/*
  Búsqueda de un curso
  Gestiona el envío de errores 404 y los 500
*/
function findCourseByUUID(uuid, res, callback ){
  models.Courses
  .find({uuid:uuid, deleted:false})
  .exec(function (err, item) {
    if(err) {
      console.log(err);
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      callback(item);
    };
  });
}


/*
  Listado de todos los cursos
*/
exports.list =  function (req, res) {

  findAllCourses(res, function(items){
    res.format({
      html: function(){
        res.render('public/courses', {
          title: 'Courses',
          courses: items
        });
      },
      json: function(){
        res.json(items);
      }
    });
  });
};

/*
  Búsqueda de todos los cursos
  Gestiona el envío de errores 404 y los 500
*/
function findAllCourses( res, callback ){
  models.Courses
  .find({ deleted:false})
  .sort('name','ascending')
  .exec(function (err, items) {
    if(err) {
      console.log(err);
      res.send(500, err.message)
    } else {
      callback(items);
    };
  });
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
  Crear curso
*/
  exports.create =  function (req, res) {
    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }
    var course = new models.Courses(req.body);
    course.save(function (err) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else {
        res.header('location',  '/courses/'+  course.uuid);
        res.send(201);

      }
    });
  };


/**
  Actualizar un curso
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
    }
    models.Courses.update({_id: req.params.id}, req.body, function (err, num) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);   // not found
      } else {
        res.send(204);   // OK, no content
      }
    });
  };

  /**
    Eliminar un curso
  */
  exports.del = function (req, res) {
    models.Courses.update({_id: req.params.id}, {deleted: true}, function (err, num) {{
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
