

var models  = require('../db/models')
  , courses = require('./courses');

 
module.exports = function (server) {

  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });

  
  // Courses

  server.get( '/courses',      courses.list);
  server.post('/courses/:id',  courses.add);
  server.get( '/courses/:id',  courses.view);
  server.put( '/courses/:id',  courses.update);
  server.del( '/courses/:id',  courses.del);
  

  // server.get('/users', function(req, res) {
  //   res.render('admin/users', { title: 'Users' });
  // });

  // server.get('/', function(req, res) {
  //   res.render('admin/editions', { title: 'Editions' });
  // });
}
