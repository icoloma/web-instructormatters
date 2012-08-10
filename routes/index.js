

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
  server.get( '/editions/new', editions.add);
  server.post('/editions',     editions.create);
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
  // server.get( '/courses/:id/editions', courses.listEditions());


  // Users
  server.get( '/users',      users.list);
  server.get('/users/new',   users.add);
  server.post('/users',      users.create);
  server.get( '/users/:id',  users.view);
  server.put( '/users/:id',  users.update);
  server.del( '/users/:id',  users.del);

  // Certificates
  server.get( '/certificates',      certificates.list);
  server.post('/certificates',      certificates.add);
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
