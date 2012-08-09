
var models = require('../db/models');

/*
  Listado de todos los cursos
*/
exports.list =  function (req, res) {
  models.Courses
    .find({deleted: false})
    .sort('name','descending')
    .exec( 
      function (err, items) {
        if(err) {
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){
              res.render('admin/courses', {
                title: 'Courses',
                courses: items
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

/*
  Mostrar un curso
*/
exports.view = function (req, res) {
  models.Courses.findById(req.params.id, function (err, item) {
    if(err) {
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function(){
          res.render('admin/course', {
            title: 'Course ' + item.name,
            course: item.toJSON()
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
        res.send(500, err.message);
      } else {
        res.header('location',  req.url + '/' + this.emitted.complete[0]._id);
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
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);  // not found
      } else {
        res.send(204);  // OK, no content
      }
    }});
  };
