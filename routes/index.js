

var models  = require('../db/models')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users')
  , editions = require('./editions');

 
module.exports = function (server) {

  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });

  // Editions
  server.get( '/editions',     editions.list);
  server.post('/editions',     editions.add);
  server.get( '/editions/:id', editions.view);
  server.put( '/editions/:id', editions.update);
  server.del( '/editions/:id', editions.del);

  // Courses
  server.get( '/courses',      courses.list);
  server.get( '/courses/new',  courses.add);
  server.post('/courses',      courses.create);
  server.get( '/courses/:id',  courses.view);
  server.put( '/courses/:id',  courses.update);
  server.del( '/courses/:id',  courses.del);

  // Users
  server.get( '/users',      users.list);
  server.post('/users',  users.add);
  server.get( '/users/:id',  users.view);
  server.put( '/users/:id',  users.update);
  server.delete( '/users/:id',  users.del);

  // Certificates
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
