

var models  = require('../db/models')
  , statics = require('./statics')
  , courses = require('./courses')
  , certificates = require('./certificates')
  , users = require('./users')
  , instructors = require('./instructors')
  , editions = require('./editions')
  , security = require('../security/securityutils')
  , passport = require('../security/setup')
  , mailer = require('../mailer/setup')
  ;
 
module.exports = function (server) {
  
  server.get('/', statics.home);
  server.get('/pricing', statics.pricing);
  
  // -- ContactForm --
  server.get('/contact',  statics.contactUsForm);
  server.post('/contact', mailer.sendMail);
 
   // -- Courses --
  server.get( '/courses', courses.list);
  server.get( '/courses/new', security.isAdmin, courses.add); // <--- order is important!
  server.get( '/courses/:uuid', security.exposeIsAllowedInstructor, courses.showDetails); 
  server.get( '/courses/:uuid/edit', security.isAdmin, courses.view); 
  server.put( '/courses/:uuid', security.isAdmin, courses.save);        
  server.del( '/courses/:uuid', security.isAdmin, courses.del);

  // -- Editions --
  server.post('/courses/:uuid/editions', security.isAllowedInstructor, editions.create);
  server.get( '/courses/:uuid/editions/new', security.isAllowedInstructor, editions.add);
  server.get( '/courses/:uuid/editions/:id', security.exposeIsAllowedInstructor, editions.showDetails);
  server.put( '/courses/:uuid/editions/:id', security.isAllowedInstructor, editions.update);
  server.del( '/courses/:uuid/editions/:id', security.isAllowedInstructor, editions.del); 
  server.get( '/courses/:uuid/editions/:id/edit', security.isAllowedInstructor,         editions.view);
  server.get( '/myeditions', editions.list); 
  server.post('/courses/:uuid/editions/:id/contact', mailer.sendMail);
  
  // -- Certificates-- 
  server.get( '/certificates/:uuid',                                  certificates.checkAvailability, certificates.view);
  server.get( '/certificates/:uuid/pdf',                              certificates.checkAvailability, certificates.pdf);
  server.post('/courses/:uuid/editions/:idEdition/certificates',      security.isAllowedInstructor, certificates.save);
  server.get( '/courses/:uuid/editions/:idEdition/certificates',      certificates.list);
  server.del( '/courses/:uuid/editions/:idEdition/certificates/:id',  security.isAllowedInstructor, certificates.del);

  // -- Users-- 
  server.get( '/users',      security.isAdmin,  users.list);
  server.get( '/users/new',  security.isAdmin,  users.add);
  server.post('/users',      security.isAdmin,  users.create);
  server.get( '/users/:id',  security.isAdmin,  users.view);
  server.put( '/users/:id',  security.isAdmin,  users.update);
  server.del( '/users/:id',  security.isAdmin,  users.del);

  // -- Instructors-- 
  server.get( '/instructors', instructors.list);
  server.get( '/instructors/course/:uuid', instructors.list);
  server.get( '/instructors/:id', instructors.show);
  server.get( '/instructors/:id/edit', instructors.view);
  server.put( '/instructors/:id', instructors.update);

  // -- Security --
  server.get('/login', 
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                              'https://www.googleapis.com/auth/userinfo.email'] }), 
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
      function(req, res){}
      );

  // Google Oauth callback
  server.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    passport.checkUser
    );

  server.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

}
