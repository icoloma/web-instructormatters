
var models = require('../db/models');

/*
* Listado de todos los usuarios
*/
exports.list =  function (req, res) {
    models.Users
    .find({deleted: false})
    .sort('name','ascending')
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){
              res.render('admin/users', {
                title: 'Users',
                users: items
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



/**
* Añadir usuario
*/
exports.add = function(req,res){
  async.parallel([
    function(cb){
      models.Courses
        .find({deleted:false})
        .sort('name','ascending')
        .exec(cb);

    }], function(err,results){
      if (err){
        res.send(500,err.message);
        return;
      }

      res.render('admin/user', {
          title: 'New User',
          user: {},
          courses: results[0]
        });
      
    });
}



/**
  Crear usuario
*/
  exports.create =  function (req, res) {
    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }
    var user = new models.Users(req.body);
    user.save(function (err) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else {
        res.header('location',  req.url + '/' + this.emitted.complete[0]._id);
        res.send(201);

      }
    });
  };


/*
* Mostrar un usuario
*/
  exports.view = function (req, res) {
    async.parallel([function(cb){
       models.Courses
        .find({deleted:false})
        .sort('name','ascending')
        .exec(cb);

    }], function(err,results){
      models.Users.findById(req.params.id, function (err, item) {
        if(err) {
          res.send(500, err.message)
        } else if(!item || (item && item.deleted)) {
          res.send(404);
        } else {
          res.format({
            html: function () {
              res.render('admin/user', {
                title: 'Edit user',
                user: item,
                courses: results[0]
              });
            },
            json : function () {
              res.send(item);
            }
          });        
        }
      });

    });

  };

/**
  Actualizar un usuario
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
    }
    models.Users.update({_id: req.params.id}, req.body, function (err, num) {
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
    Eliminar un ususario
  */
  exports.del = function (req, res) {
    models.Users.update({_id: req.params.id}, {deleted: true}, function (err, num) {{
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
