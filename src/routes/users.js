
var Courses = require('../db/models').Courses,
  Users = require('../db/models').Users;

/*
* Listado de todos los usuarios
*/
exports.list =  function (req, res, next) {
  Users.findAllUsers(function (err, users) {
    if(err) return next(err);

    res.format({
      html: function () {
        res.render('admin/users', {
          title: 'Users',
          users: users
        });
      },
      json: function () {
        res.json(users);
      }
    });

  });
};

/**
* Añadir usuario
*/
exports.add = function(req, res, next) {
  Courses.findAllCourses(function (err, courses) {
    if(err) return next(err);
    res.render('admin/user', {
      title: 'New User',
      user: { admin:false , certified:false, courses: []},
      courses: courses
    });
  });
}



/**
  Crear usuario
*/
exports.create =  function (req, res, next) {
  if (!req.accepts('application/json')){
    res.send(406);  //  Not Acceptable
  }

  Users.addUser(req.body, function (err, userID) {
    if(err) return next(err);
    res.header('location',  req.url + '/' + userID);
    res.send(201);
  });
}


/*
* Mostrar un usuario
*/
exports.view = function (req, res, next) {
  async.parallel([
    Courses.findAllCourses.bind(Courses),
    function (cb) {
      Users.findUser(req.params.id, cb)
    }
  ],
  function (err, results) {
    if(err) return next(err);

    var courses = results[0],
      user = results[1];

    res.format({
      html: function () {
        res.render('admin/user', {
          title: 'Edit user',
          user: user,
          courses: courses
        });
      },
      json : function () {
        res.send(user);
      }
    });
  });
}

/**
  Actualizar un usuario
*/
exports.update = function (req, res, next) {
  if (!req.accepts('application/json')){
     res.send(406);  //  Not Acceptable
  }
  
  Users.updateUser(req.params.id, req.body, function (err, num) {
    if(err) return next(err);
    res.send(204);   // OK, no content
  });
};

/**
  Eliminar un ususario
*/
exports.del = function (req, res, next) {
  Users.deleteUser(req.params.id, function (err, num) {
    if(err) return next(err);
    res.send(204);  // OK, no content
  });
};

