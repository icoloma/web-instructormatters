
var models = require('../db/models');

/*
* Listado de todos los cursos
*/
exports.list =  function (req, res) {
    models.Courses.find({deleted: false}, function (err, items) {
      if(err) {
        res.send(500, err.message);
      } else {
        res.type('application/json');
        //Fix: parsear JSON (es esto JSON válido? JSON.stringify...)
        res.send(items);
      }
    });
  };

/**
* Añadir curso
*/
  exports.add =  function (req, res) {
    req.accepts('application/json');
    var course = new models.Courses(req.body);
    course.save(function (err) {
      console.log(req.headers);
      if(err) {
        res.send(500, err.message);
      } else {
        //Fix Url completa
        //res.header('location', req.headers.host + req.url + '/' + this.emitted.complete[0]._id);
        res.header('location',  req.url + '/' + this.emitted.complete[0]._id);
        res.send(201);

      }
    });
  };

/*
* Mostrar un curso
*/
  exports.view = function (req, res) {
    models.Courses.findById(req.params.id, function (err, item) {
      if(err) {
        res.send(500, err.message)
      } else if(!item || (item && item.deleted)) {
        res.send(404);
      } else {
        if (req.accepts('html')) {
          res.render('admin/courses-edit', {
            title: 'Edit ' + item.name,
            course: item
          });
        } else if(req.accepts('json')) {
          // res.type('application/json');
          res.send(item);
        } else {
          res.send(406);
        }
        
      }
    })
  };

/**
* Actualizar un curso
*/
  exports.update = function (req, res) {
    req.accepts('application/json');
    models.Courses.update({_id: req.params.item}, req.body, function (err, num) {
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    });
  };

  /**
  * Eliminar un curso
  */
  exports.del = function (req, res) {
    models.Courses.update({_id: req.params.item}, {deleted: true}, function (err, num) {{
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    }});
  };
