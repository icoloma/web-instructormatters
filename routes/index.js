

var models  = require('../db/models')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users');

 
module.exports = function (server) {

  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });

  
  // Courses

  server.get( '/courses',      courses.list);
  server.post('/courses/',  courses.add);
  server.get( '/courses/:id',  courses.view);
  server.put( '/courses/:id',  courses.update);
  server.del( '/courses/:id',  courses.del);

  server.get( '/users',      users.list);
  server.post('/users',  users.add);
  server.get( '/users/:id',  users.view);
  server.put( '/users/:id',  users.update);
  server.del( '/users/:id',  users.del);

  server.get( '/certificates',      certificates.list);
  server.post('/certificates',  certificates.add);
  server.get( '/certificates/:id',  certificates.view);
  server.put( '/certificates/:id',  certificates.update);
  server.del( '/certificates/:id',  certificates.del);

  // server.get('/users', function(req, res) {
  //   res.render('admin/users', { title: 'Users' });
  // });

  // server.get('/', function(req, res) {
  //   res.render('admin/editions', { title: 'Editions' });
  // });
}
