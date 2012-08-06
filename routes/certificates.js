
var models = require('../db/models');

/*
* Listado de todos los certificados
*/
exports.list =  function (req, res) {
    models.Certificates.find({deleted: false}, function (err, items) {
      if(err) {
        res.send(500, err.message);
      } else {
        res.format({
          html: function () {
            res.render('admin/certificates', {
              title: 'Certificates',
              certificates: items
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
* Añadir certificado
*/
  exports.add =  function (req, res) {
    var certificate = new models.Certificates(req.body);
    certificate.save(function (err) {
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
* Mostrar un certificado
*/
  exports.view = function (req, res) {
    models.Certificates.findById(req.params.id, function (err, item) {
      if(err) {
        res.send(500, err.message)
      } else if(!item || (item && item.deleted)) {
        res.send(404);
      } else {
        res.format({
          html: function () {
            res.render('admin/certificates-edit', {
              title: 'Edit ' + item.name,
              certificate: item
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
* Actualizar un certificado
*/
  exports.update = function (req, res) {
    req.accepts('application/json');
    models.Certificates.update({_id: req.params.item}, req.body, function (err, num) {
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
  * Eliminar un certificado
  */
  exports.del = function (req, res) {
    models.Certificates.update({_id: req.params.item}, {deleted: true}, function (err, num) {{
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    }});
  };
