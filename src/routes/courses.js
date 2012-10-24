var models = require('../db/models');
var editions = require('./editions.js');

/*
  Mostrar un curso (edicion)
*/
exports.view = function (req, res) {

  findCourseByUUID(req.params.uuid, res, function(items){
    var course = items[0];
    res.format({
        html: function(){
          res.render('admin/course', {
            title: 'Course',
            course: course
          });
        },
        json: function(){
          res.json(course);
        }
    });
  });
}

/*
  Mostrar un curso (public)
*/
exports.showDetails = function (req, res) {
  findCourseByUUID(req.params.uuid, res, function(items){
    var course = items[0];
    res.format({
        html: function(){
           async.parallel(
            [function (cb) {
               models.Editions
                .find({deleted: false, courseUUID:course.uuid})
                .sort('date','descending')
                .exec(cb);
            }],
           function( err, results){
              var editions = results[0];
              addCourseVideos(course, function(err,items){
                res.render('public/course', {
                  title: course.name,
                  course: course,
                  editions: editions
                });
              },100,3);
            }
          );
        },
        json: function(){
          res.json(course);
        }
      });
  });
};

/*
  Búsqueda de un curso
  Gestiona el envío de errores 404 y los 500
*/
function findCourseByUUID(uuid, res, callback ){
  models.Courses
  .find({uuid:uuid, deleted:false})
  .exec(function (err, item) {
    if(err) {
      codeError(500, err.message)
    } else if(!item || (item && item.deleted)) {
      codeError(404,'Course not found');
    } else {
      callback(item);
    };
  });
}


/*
  Listado de todos los cursos
  Mostramos una lista de vídeos por cada curso así como las siguientes ediciones
*/
exports.list =  function (req, res) {

  var now =  /(.+)T.+/.exec(new Date().toISOString());
  editions.getEditionsWithCourseInfo( {
    deleted:false, 
    "date" : { "$gte" : now[1] }
  },function( err, editions){
    models.Courses
      .find({deleted:false})
      .sort('name','ascending')
      .exec(function (err, courses) {
        async.map(courses,
          function(course, cb){
            // Añadimos los vídeos de cada curso
            addCourseVideos(course,cb,3,1);
          },
          function(err,results){

            // Mostramos como máximo 3 vídeos de diferentes instructores

            res.render('public/courses', {
              title: 'Courses',
              courses: results,
              editions: editions
            });

          }
        );
      });
  })
};

var filterVideoCourses = function( courses ){

}

var addCourseVideos = function( course, callback, numUsers, numVideos){
  // Buscamos usuarios con videos del curso
  models.Users
    .find({
      deleted:false,
      "videos.courseUUID":course.uuid
      })
    .exec( function (error, users){
      users = _.first(users,numUsers);
      // extraemos solo los videos del curso
      course.videos = _.map(users, 
          function(user){
            return _.first(_.compact(_.map(user.videos, 
              function(video){ 
                if (course.uuid === video.courseUUID){
                  video.user ={};
                  video.user.name=user.name;
                  video.user.id=user.id
                  return video;
                }
              }
            )),numVideos);      
          });
      callback(null,course);
    });

}

/*
  Añadir curso - ventana 
*/
exports.add = function(req,res){
  res.render('admin/course', {
      title: 'New Course ',
      course: {}
    });
}


/**
  Crear/Actualizar un curso
  Hack: backbone siempre interpretará las inserciones como actualizaciones  (simpre existe uuid) y por tanto
  siempre hará un PUT a /courses/:uuid. 
  Hay que distinguir en el lado servidor cuando es inserción y cuando actualización
*/
  exports.save = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
       return;
    }

    var json = req.body;

    if (!json.id) {
      // Inserción 
      var course = new models.Courses(json);
      course.save(function (err) {
        if(err) {
          codeError(500, err.message.match(/E11000.+/) ? 'Course UUID already exists' : err.message);
        } else {
          res.header('location',  '/courses/'+  course.uuid);
          res.send(201);
        }
      });
    } else {
      // actualizamos
      models.Courses.update({uuid: req.params.uuid}, json, function (err, num) {
        if(err) {
          codeError(500, err.message);
        } else if(!num) {
          codeError(404,'Not found');   // not found
        } else {
          res.send(204);   // OK, no content
        }
      });
    }
 };

  /**
    Eliminar un curso
  */
  exports.del = function (req, res) {
    models.Courses.update({uuid: req.params.uuid}, {deleted: true}, function (err, num) {{
      if(err) {
        codeError(500, err.message);
        return;
      } 
      if(!num) {
        codeError(404,'Not found');
      } 
      res.send(204);  // OK, no content
      
    }});
  };



