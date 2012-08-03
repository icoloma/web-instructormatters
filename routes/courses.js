
var models = require('../db/models');

var acceptsJSON = function (req, res, next) {
  if(req.accepts('application/json')) {
    next();
  } else {
    //Not acceptable
    res.send(406);
  }
}

var isJSON = function (req, res, next) {
  if(req.header('Content-Type') === 'application/json') {
    next();
  } else {
    //Not acceptable
    res.send(406);
  }
}

module.exports = function (server) {

  server.get('/courses', acceptsJSON,  function (req, res) {
    models.Courses.find({deleted: false}, function (err, items) {
      if(err) {
        res.send(500, err.message);
      } else {
        res.set('Content-Type', 'application/json');
        //Fix: parsear JSON (es esto JSON válido? JSON.stringify...)
        res.send(items.map(function (item) {
          return {
            name: item.name,
            //Fix Url completa
            _id: item._id 
          }
        }));
      }
    });
  });

  server.post('/courses', isJSON, function (req, res) {
    var course = new models.Courses(req.body);
    course.save(function (err) {
      console.log(req.headers);
      if(err) {
        res.send(500, err.message);
      } else {
        //Fix Url completa
        res.header('location', req.headers.host + req.url + '/' + this.emitted.complete[0]._id)
        res.send(201);

      }
    });
  });

  server.get('/courses/:id', acceptsJSON, function (req, res) {
    models.Courses.findById(req.params.id, function (err, item) {
      if(err) {
        res.send(500, err.message)
      } else if(!item || (item && item.deleted)) {
        res.send(404);
      } else {
        delete item.deleted
        res.send(item)
        console.log(item.deleted)
      }
    })
  });

  server.put('/courses/:item', isJSON, function (req, res) {
    models.Courses.update({_id: req.params.item}, req.body, function (err, num) {
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    });
  });

  server.del('/courses/:item', function (req, res) {
    models.Courses.update({_id: req.params.item}, {deleted: true}, function (err, num) {{
      if(err) {
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);
      } else {
        res.send(204);
      }
    }});
  });

  // server.get('/courses/new', function (req, res) {
  //   res.render('admin/courses-new', {title: 'Add new course'})
  // });

  // server.get('/courses/:item/edit', function (req, res) {
  //   models.Courses.findById(req.params.item, function (err, item) {
  //     res.render('admin/courses-edit', {
  //       title: 'Edit ' + item.name,
  //       course: item
  //     });
  //   });
  // });

  // server.post('/courses/:item/update', function (req, res) {
  //   // console.log(req.b)
  //   models.Courses.update({_id: req.params.item}, req.body, function (err) {
  //       req.flash('error', 'sdfsfsdfsdf');
  //       // console.log(req.flash())
  //     if(err) {
  //       // res.render('admin/courses-edit', {
  //       //   error: err, 
  //       //   title: 'Edit ' + req.params.item.name,
  //       //   course
  //       // })
  //       res.redirect('back')
  //     } else {
  //       res.redirect('/courses');
  //     }
  //   });
  // });

  // server.post('/courses/:item/delete', function (req, res) {
  //   console.log(req.params)
  //   models.Courses.update({_id: req.params.item}, {deleted: true}, function (err) {
  //     res.redirect('/courses');
  //   });
  // });
};