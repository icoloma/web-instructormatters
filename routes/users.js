
var models = require('../db/models');

/*
* Listado de todos los usuarios
*/
exports.list =  function (req, res) {
    models.Users.find({deleted: false}, function (err, items) {
      if(err) {
        res.send(500, err.message);
      } else {
        res.format({
          html: function () {
            res.render('admin/users', {
              title: 'Users',
              users: items
            })
          },
          json: function () {
            //Fix: parsear JSON (es esto JSON válido? JSON.stringify...)
            res.send(items);
          }
        });
      }
    });
  };

/**
* Añadir usuario
*/
  exports.add =  function (req, res) {
    var user = new models.Users(req.body);
    user.save(function (err) {
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
* Mostrar un usuario
*/
  exports.view = function (req, res) {
    models.Users.findById(req.params.id, function (err, item) {
      if(err) {
        res.send(500, err.message)
      } else if(!item || (item && item.deleted)) {
        res.send(404);
      } else {
        res.format({
          html: function () {
            res.render('admin/user', {
              title: 'Edit ' + item.name,
              user: item
            });
          },
          json : function () {
            res.send(item);
          }
        });        
      }
    });
  };

/**
* Actualizar un usuario
*/
  exports.update = function (req, res) {
    req.accepts('application/json');
    models.Users.update({_id: req.params.item}, req.body, function (err, num) {
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
  * Eliminar un usuario
  */
  exports.del = function (req, res) {
    models.Users.update({_id: req.params.item}, {deleted: true}, function (err, num) {{
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    }});
  };