

var models  = require('../db/models')
  , courses = require('./courses')
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

  server.get( '/courses',     courses.list);
  server.post('/courses',     courses.add);
  server.get( '/courses/:id', courses.view);
  server.put( '/courses/:id', courses.update);
  server.del( '/courses/:id', courses.del);
  

  // server.get('/users', function(req, res) {
  //   res.render('admin/users', { title: 'Users' });
  // });

  // server.get('/', function(req, res) {
  //   res.render('admin/editions', { title: 'Editions' });
  // });
}
