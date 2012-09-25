
var models = require('../db/models')
  , youtube  = require('../videos/youtube')

/*
* Listado de todos los instructores
*/
exports.list =  function (req, res) {
    models.Users
    .find({
      deleted: false,
      admin: false,
      name : { $exists: true}
    })
    .sort('name','ascending')
    .select('name id geopoint address oauth')
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){
              var json = JSON.stringify(items);
              res.render('public/instructors', {
                title: 'instructors',
                instructors: items,
                json: json
              });
            },
            json: function(){
              res.json(items);
            }
          });
        };
      }
    )
  };


/*
*Información pública del instructor
*/
exports.show =  function (req, res) {
  async.parallel([function(cb){
    getCoursesMap(cb);
  }, function(cb){
    models.Users
    .find({
      _id: req.params.id,
      deleted: false,
      admin: false,
    })
    .select("id name address videos email oauth geopoint")
    .exec(cb)
  }], function (err, items) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
        return;
      } 
      var coursesMap = items[0];
      var instructor = items[1][0];
      _.forEach(instructor.get('videos'), function(video){
         video.course = coursesMap[video.courseUUID]; 
      });
      res.format({
        html: function(){
          res.render('public/instructor', {
            title: 'instructor',
            instructor: instructor,
            geolocation: instructor.geopoint.lat + ',' +  instructor.geopoint.lng + '&z=' + instructor.geopoint.zoom,
          });
        },
        json: function(){
          res.json(items);
        }
      });
    })
  };


/*
* Información para editar el instructor
*/
exports.view =  function (req, res) {
  async.parallel([function(cb){
    getCoursesMap(cb);
  }, function(cb){
   models.Users
    .find({
      _id: req.params.id,
      deleted: false,
      admin: false,
    }).exec(cb)
  }], function(err,items){
    if(err) {
      console.log(err);
      res.send(500, err.message);
    }
    var coursesMap = items[0];
    var instructor = items[1][0];
    res.format({
      html: function(){
        res.render('admin/instructor', {
          title: 'instructor',
          instructor: instructor.toJSON(),
          courses: coursesMap
        });
      },
      json: function(){
        res.json(instructor);
      }
    });
  });
};


/*
  Mapa con los cursos 
   clave : uuid
   valor : name
*/
var getCoursesMap = function(callback){
  async.series([function(cb){
    models.Courses
      .find({deleted:false})
      .sort('name','ascending')
      .select('uuid name')
      .exec(cb);
  }], function(err, items){
   if (err){
      callback(err);
   }
   var coursesMap = {}
      items[0].forEach(function(course) {
        coursesMap[course.uuid] = course.name;
      });
      callback(null,coursesMap);
  });
}


/**
  Actualizar un instructor
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
    }

    models.Users.update({_id: req.params.id}, req.body, function (err, num) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);   // not found
      } else {
        res.send(204);   // OK, no content
      }
    });
  };
 



