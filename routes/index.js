

var models  = require('../db/models')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users')
  , security = require('./security')
  , editions = require('./editions')
  ;
 
module.exports = function (server) {


  // Default view
  server.get('/', function(req, res) {
    res.render('admin', { title: 'Admin' });
  });

  // Security
  server.get( '/login',   security.show);
  server.post('/login',   security.login);
  server.get( '/logout',  security.logout);


  // Courses
  server.get( '/courses',             courses.list);        // listado de todos los cursos
  server.get( '/courses/new',         courses.add);         // muestra formulario para crear curso 
  server.get( '/courses/:uuid',       courses.showDetails); // muestra un curso - readOnly
  server.get( '/courses/:uuid/edit',  courses.view);        // muestra un curso - edición
  server.put( '/courses/:uuid',       courses.save);        // crear / actualizar curso
  server.del( '/courses/:uuid',       courses.del);         // eliminar curso
  //server.post('/courses',             courses.create);  // not used

  // Editions
  server.post('/courses/:uuid/editions',          editions.create);
  server.get( '/courses/:uuid/editions/new',      editions.add);
  server.get( '/courses/:uuid/editions/:id',      editions.showDetails);
  server.put( '/courses/:uuid/editions/:id',      editions.update);
  server.del( '/courses/:uuid/editions/:id',      editions.del); 
  server.get( '/courses/:uuid/editions/:id/edit', editions.view);
  
  // Certificates
  
  server.get( '/certificates/:uuid',                                  certificates.view);
  server.get( '/certificates/:uuid/pdf',                              certificates.pdf);
  server.post('/courses/:uuid/editions/:idEdition/certificates',      certificates.save);
  server.get( '/courses/:uuid/editions/:idEdition/certificates',      certificates.list);
  server.del( '/courses/:uuid/editions/:idEdition/certificates/:id',  certificates.del);

  // Users
  server.get( '/admin/users',      users.list);
  server.get( '/admin/users/new',  users.add);
  server.post('/admin/users',      users.create);
  server.get( '/admin/users/:id',  users.view);
  server.put( '/admin/users/:id',  users.update);
  server.del( '/admin/users/:id',  users.del);


 
}
