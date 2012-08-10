
var models = require('../db/models');

/*
  Listado de todas las ediciones
*/
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
      }
    )
};

/*
* Mostrar una ediciones
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
              models.Courses
                .find({deleted: false})
                .select('name')
                .sort('name','ascending')
                .exec(cb)
            }, function (cb) {
              models.Users
                .find({deleted: false})
                .select('name')
                .sort('name','ascending')
                .exec(cb)
            }], function (err, results) {
                // TODO: error handling
                if (err){
                  console.log(error);
                  res.send(500,err.message);
                } else {
                  res.render('admin/edition', {
                    title: 'Edition',
                    edition: item,
                    instructors: results[1],
                    courses: results[0]
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
  async.parallel([
    function (cb) {
      models.Courses
        .find({deleted: false})
        .select('name')
        .sort('name','ascending')
        .exec(cb)
    }, function (cb) {
      models.Users
        .find({deleted: false})
        .select('name') 
        .sort('name','ascending')
        .exec(cb)
    }], function (err, results) {
        //error handling
          res.render('admin/edition', {
            title: 'Edition',
            edition: {},
            instructors: results[1],
            courses: results[0]
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
    var edition = new models.Editions(req.body);
    edition.save(function (err) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else {
        res.header('location',  req.url + '/' + this.emitted.complete[0]._id);
        res.send(201);

      }
    });
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
    console.log(JSON.stringify(req.body));
    models.Editions.update({_id: req.params.id}, req.body, function (err, num) {
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

