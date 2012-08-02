

var models = require('../db');

module.exports = function (server) {

  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });

  server.get('/courses', function (req, res) {
    models.Courses.find({deleted: false}, function (err, items) {
      res.render('admin/courses', { 
        title: 'Courses',
        courses: items 
        }
      );
    });
  });

  server.get('/courses/new', function (req, res) {
    res.render('admin/courses-new', {title: 'Add new course'})
  });

  server.post('/courses/add', function (req, res) {
    var course = new models.Courses(req.body);
    course.save(function (err) {
      console.log(err);
      res.redirect("/courses");
    });
  });

  server.get('/courses/:item/edit', function (req, res) {
    models.Courses.findById(req.params.item, function (err, item) {
      res.render('admin/courses-edit', {
        title: 'Edit ' + item.name,
        course: item
      });
    });
  });

  server.post('/courses/:item/update', function (req, res) {
    // console.log(req.b)
    models.Courses.update({_id: req.params.item}, req.body, function (err) {
      res.redirect('/courses');
    });
  });

  server.post('/courses/:item/delete', function (req, res) {
    console.log(req.params)
    models.Courses.update({_id: req.params.item}, {deleted: true}, function (err) {
      res.redirect('/courses');
    });
  });

  // server.get('/users', function(req, res) {
  //   res.render('admin/users', { title: 'Users' });
  // });

  // server.get('/', function(req, res) {
  //   res.render('admin/editions', { title: 'Editions' });
  // });
}
