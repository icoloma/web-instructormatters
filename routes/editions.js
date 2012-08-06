
var models = require('../db/models');

/*
* Listado de todos los cursos
*/
exports.list =  function (req, res) {
  models.Editions.find({deleted: false}, function (err, items) {
    if(err) {
      res.send(500, err.message);
    } else {
      res.format({
        html: function(){
          res.render('admin/editions', {
            title: 'Editions',
            editions: items
          });
        },
        json: function(){
          res.json(items);
        }
      });
    };
  });
};

/*
* Mostrar un curso
*/
exports.view = function (req, res) {
  models.Editions.findById(req.params.id, function (err, item) {
    if(err) {
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function(){
          res.render('admin/edition', {
            title: 'Edition info',
            course: item
          });
        },
        json: function(){
          res.json(item);
        }
      });
    };
  });
};


/**
* Añadir curso
*/
  exports.add =  function (req, res) {
    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }
    var edition = new models.Editions({
      date: req.body.date,
      venue: req.body.venue,
      instructor: req.body.instructorId,
      course: req.body.courseId
    });

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
* Actualizar un curso
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
    }
    models.Editions.update({_id: req.params.item}, req.body, function (err, num) {
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
  * Eliminar un curso
  */
  exports.del = function (req, res) {
    models.Editions.update({_id: req.params.item}, {deleted: true}, function (err, num) {{
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);  // not found
      } else {
        res.send(204);  // OK, no content
      }
    }});
  };
