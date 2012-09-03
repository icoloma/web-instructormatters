

var models  = require('../db/models')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users')
  , editions = require('./editions')
  , security = require('../security/securityutils')
  , passport = require('../security/setup');
  ;
 
module.exports = function (server) {

  // Default view
  server.get('/', editions.following);
  
 
  // Courses
  server.get( '/courses',             courses.list);                                              // listado de todos los cursos
  server.get( '/courses/new',         security.isAdmin,                     courses.add);         // muestra formulario para crear curso 
  server.get( '/courses/:uuid',       security.exposeIsAllowedInstructor,   courses.showDetails); // muestra un curso - readOnly
  server.get( '/courses/:uuid/edit',  security.isAdmin,                     courses.view);        // muestra un curso - edición
  server.put( '/courses/:uuid',       security.isAdmin,                     courses.save);        // crear / actualizar curso
  server.del( '/courses/:uuid',       security.isAdmin,                     courses.del);         // eliminar curso
  //server.post('/courses',             courses.create);  // not used

  // Editions
  server.post('/courses/:uuid/editions',          security.isAllowedInstructor,         editions.create);
  server.get( '/courses/:uuid/editions/new',      security.isAllowedInstructor,         editions.add);
  server.get( '/courses/:uuid/editions/:id',      security.exposeIsAllowedInstructor,   editions.showDetails);
  server.put( '/courses/:uuid/editions/:id',      security.isAllowedInstructor,         editions.update);
  server.del( '/courses/:uuid/editions/:id',      security.isAllowedInstructor,         editions.del); 
  server.get( '/courses/:uuid/editions/:id/edit', security.isAllowedInstructor,         editions.view);
  server.get( '/myeditions', editions.list); 
  
  // Certificates
  server.get( '/certificates/:uuid',                                  certificates.checkAvailability, certificates.view);
  server.get( '/certificates/:uuid/pdf',                              certificates.checkAvailability, certificates.pdf);
  server.post('/courses/:uuid/editions/:idEdition/certificates',      security.isAllowedInstructor, certificates.save);
  server.get( '/courses/:uuid/editions/:idEdition/certificates',      certificates.list);
  server.del( '/courses/:uuid/editions/:idEdition/certificates/:id',  security.isAllowedInstructor, certificates.del);

  // Users
  server.get( '/users',      security.isAdmin,  users.list);
  server.get( '/users/new',  security.isAdmin,  users.add);
  server.post('/users',      security.isAdmin,  users.create);
  server.get( '/users/:id',  security.isAdmin,  users.view);
  server.put( '/users/:id',  security.isAdmin,  users.update);
  server.del( '/users/:id',  security.isAdmin,  users.del);

  /* 
    Security
  */
  
  // login (via google oauth )
  server.get('/login', 
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                              'https://www.googleapis.com/auth/userinfo.email'] }), 
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
      function(req, res){}
      );

// Logout
  server.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

  // Google Oauth callback
  server.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    passport.checkUser
    );

 
}
