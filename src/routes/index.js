

var models  = require('../db/models')
  , statics = require('./statics')
  , courses = require('./courses')
  , videos = require('./videos')
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
  server.get('/login', statics.login);
  server.get('/pricing', statics.pricing);
  
  // -- ContactForm --
  server.get('/contact',  statics.contactUsForm);
  server.post('/contact', mailer.checkRecaptcha, mailer.sendMail);
 
   // -- Courses --
  server.get( '/courses', courses.list);
  server.get( '/courses/new', security.isAdmin, courses.add); // <--- order is important!
  server.get( '/courses/:uuid', security.exposeInstructor, courses.showDetails);
  server.get( '/courses/:uuid/edit', security.isAdmin, courses.view); 
  server.put( '/courses/:uuid', security.isAdmin, courses.save);        
  server.del( '/courses/:uuid', security.isAdmin, courses.del);

  // -- Editions --
  server.post('/courses/:uuid/editions', security.isCertifiedInstructor, editions.create);
  server.get( '/courses/:uuid/editions/new', security.isCertifiedInstructor, editions.add); // <--- order is important!
  server.get( '/courses/:uuid/editions/:idEdition', security.exposeInstructor, editions.showDetails);
  server.put( '/courses/:uuid/editions/:idEdition', security.isEditionOwner, editions.update);
  server.del( '/courses/:uuid/editions/:idEdition', security.isEditionOwner, editions.del);
  server.get( '/courses/:uuid/editions/:idEdition/edit', security.isEditionOwner, editions.view);
  server.get( '/myeditions', editions.list); 
  server.post('/courses/:uuid/editions/:idEdition/contact', mailer.checkRecaptcha, editions.sendMail, mailer.sendMail);
  
  // -- Certificates-- 
  server.get( '/certificates/:uuid', certificates.checkAvailability, certificates.pdf);
  server.post('/courses/:uuid/editions/:idEdition/certificates', security.isEditionOwner, certificates.save);
  server.get( '/courses/:uuid/editions/:idEdition/certificates', certificates.list);
  server.post( '/courses/:uuid/editions/:idEdition/certificates/send', security.isEditionOwner, certificates.send);
  server.del( '/courses/:uuid/editions/:idEdition/certificates/:id', security.isEditionOwner, certificates.del);

  // -- Users-- 
  server.get( '/users',      security.isAdmin,  users.list);
  server.get( '/users/new',  security.isAdmin,  users.add);
  server.post('/users',      security.isAdmin,  users.create);
  server.get( '/users/:id',  security.isAdmin,  users.view);
  server.put( '/users/:id',  security.isAdmin,  users.update);
  server.del( '/users/:id',  security.isAdmin,  users.del);

  // -- Instructors-- 
  server.get( '/instructors', instructors.list);
  server.get( '/instructors/course/:uuid', instructors.addCourseInfo, instructors.list);
  server.get( '/instructors/:idInstructor', instructors.show);
  server.get( '/instructors/:idInstructor/edit', security.isHimself, instructors.view);

  server.put( '/instructors/:idInstructor', security.isHimself, instructors.update);
  server.del( '/instructors/:idInstructor', security.isHimself, instructors.del);


  // -- Videos-- 
  server.get( '/ranking/update', security.isAdmin, instructors.updateRanking);
  server.get( '/instructors/:idInstructor/videos',  videos.list);
  server.del( '/instructors/:idInstructor/videos/:idVideo', security.isHimself, videos.del);
  
  // -- Security --
  server.get('/login-auth', 
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
