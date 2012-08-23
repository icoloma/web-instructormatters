

var models  = require('../db/models')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users')
  , editions = require('./editions');

 
module.exports = function (server) {

  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });


  // Courses
  server.get( '/admin/courses/new', courses.add);
  server.post('/admin/courses',     courses.create);
  server.get( '/admin/courses/:id', courses.view);
  server.put( '/admin/courses/:id', courses.update);
  server.del( '/admin/courses/:id', courses.del);

  // Editions
  server.post('/admin/courses/:idCourse/editions',     editions.create);
  server.get( '/admin/courses/:idCourse/editions/new', editions.add);
  server.get( '/admin/courses/:idCourse/editions/:id', editions.view);
  server.put( '/admin/courses/:idCourse/editions/:id', editions.update);
  server.del( '/admin/courses/:idCourse/editions/:id', editions.del); 
  
  // Certificates
  server.get( '/admin/courses/:idCourse/editions/:idEdition/certificates/new', certificates.add);
/*
  server.post('/admin/courses/:idCourse/editions/:idEdition/certificates',     certificates.create);
*/


  // Users
  server.get( '/admin/users',      users.list);
  server.get( '/admin/users/new',   users.add);
  server.post('/admin/users',      users.create);
  server.get( '/admin/users/:id',  users.view);
  server.put( '/admin/users/:id',  users.update);
  server.del( '/admin/users/:id',  users.del);

  
  // Parte pública
  server.get( '/courses',                     courses.list);
  server.get( '/courses/:uuid',               courses.showDetails);
  server.get( '/courses/:uuid/editions/:id',  editions.showDetails);
  server.get( '/certificates/:uuid',          certificates.view);


  /*
  server.get( '/admin/certificates',      certificates.list);
  server.put( '/admin/certificates/:id',  certificates.update);
  server.del( '/admin/certificates/:id',  certificates.del);
  */


  // server.get('/users', function(req, res) {
  //   res.render('admin/users', { title: 'Users' });
  // });

  // server.get('/', function(req, res) {
  //   res.render('admin/editions', { title: 'Editions' });
  // });
}
