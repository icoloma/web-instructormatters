
var Users = require('../db/models').Users
  , Courses = require('../db/models').Courses
  , services = require('../db/models').services
  , Videos = require('../db/models').Videos
  , request = require('request')
  , googleMapURL = require('../db/models/helpers').googleMapURL
  , codeError = require('./errorHandlers').codeError;

/*
* Listado de todos los instructores
*/
exports.list =  function (req, res, next) {
  var query = {  address : { $exists : true }, deleted: false, courses: { $ne : [] }};
  if (req.params.uuid){
    query.courses = req.params.uuid;
  }
  Users.findInstructors(query,
      function (err, items) {
        if(err) return next(err);

        // check if instructor is certified
        _.map(items, function(instructor){

          if (!instructor.certificates){
            instructor.certified = false;
          } else if(!req.params.uuid){
            // is certified in any course?
            instructor.certified = instructor.certificates.length > 0;
          } else {
            // is certified in the request course?
            instructor.certified =  _.contains( instructor.certificates, req.params.uuid);
          }
          delete instructor.certificates;
          
        });

        var title = (!res.locals.courseName) ? 'All Instructors' : 'Instructors for ' + res.locals.courseName;
        
        res.format({
          html: function () {
            var json = JSON.stringify(items);
            res.render('public/instructors', {
              title: title,
              instructors: items,
              json: json
            });
          },
          json: function () {
            res.json(items);
          }
        });
      }
    )
  };

/*
 Añade el nombre del curso a la request
*/ 
exports.addCourseInfo = function (req,res,next){
 if (req.params.uuid){
  Courses.findCourseByUUID( req.params.uuid, function(err, course){
    res.locals.courseName = course.name;
    next();
  });
 } else {
   next();
 }
};


/*
  Información pública del instructor
*/
exports.show =  function (req, res, next) {
  services.getInstructorFullInfo(req.params.idInstructor, function (err, instructor) {
    if(err) return next(err);
    instructor = _.omit(instructor, ['admin', 'expires'])
    res.format({
      html: function(){
        instructor.googleMapURL =googleMapURL(instructor),
        res.render('public/instructor', {
          title: instructor.name,
          instructor: instructor
        });
      },
      json: function(){
        res.json(instructor); 
      }
    });
  });
};




/*
* Información para editar el instructor
*/
exports.view =  function (req, res, next) {

  async.parallel([
    function (callback) {
      Courses.findAllCourses(function (err, courses) {
        if(err) return next(err);
        callback(err,courses);
      });
    },
    function (callback) {
      Users.findUser(req.params.idInstructor, callback);
    }
    ],
    function (error,results) {
      if(error) return next(err);
      if(res.locals.isAdmin || res.locals.currentUser.id === req.params.idInstructor) {
        res.format({
          html: function(){
            res.render('admin/instructor', {
              title: 'instructor',
              instructor: results[1],
              courses: results[0]
            });
          },
          json: function(){
            res.json(instructor);
          }
        });
      }
  });
};


/**
  Actualizar un instructor
*/
  exports.update = function (req, res, next) {
    if (!req.accepts('application/json')) {
       next(codeError(406,'Not acceptable'));
       return;
    }

    var instructor = _.omit(req.body, "admin", "certificates");

    doUpdateVideoInstructorRanking(instructor, function( instructor){
      Users.updateInstructor(req.params.idInstructor, instructor, 
        function (err, num) {
          if(err) return next(err);
          res.send(204);   // OK, no content
        }
      );
    });
  };
 


 exports.del = function (req, res, next) {
  Users.deleteUser(req.user.id, function (err, num) {
    if(err) return next(err);
    req.logOut();
    res.format({
          html: function(){
            res.redirect('/');
            return;
          },
          json: function(){
            res.send(204);  // OK, no content
            return;
          }
    });
  });
},

/** launched from URL */
exports.updateRanking = function(req,res,next) {
  updateInstructorRanking( function(err){
    if (err) {
      res.redirect("/#error");
    }else {
      res.redirect("/");
    }
  });
};


var updateInstructorRanking = function( callback ){
  Users.findAllUsers( 
    function(err, instructors){
      if (err) { callback(err); return;}
      console.log("updating instructos ranking ...");
      var numInstructorProcessed = 0;
      _.each( instructors, function(instructor){
        instructor = _.omit( instructor,'expires');  // da problemas?
        doUpdateVideoInstructorRanking(
          instructor, 
          _.bind(function(instructorWithRanking){
            console.log("Updating " + instructorWithRanking.id)
            Users.updateInstructor(
              instructorWithRanking.id, 
              instructorWithRanking, 
            
              function(err,num){
                  if (err) { callback(err);} 
                  console.log(instructorWithRanking.email + "  updated with ranking =" + instructorWithRanking.ranking);
                  numInstructorProcessed = numInstructorProcessed + 1;
                  if (numInstructorProcessed === instructors.length){
                    console.log("ranking updated");
                    callback(null);
                  }
               });

          },this)
        );
      }, this); 
    });
};

exports.updateInstructorRanking = updateInstructorRanking;

doUpdateVideoInstructorRanking = function( instructor, callback) {
    Videos.findInstructorVideos(instructor.id, function(err, videos){
      if (err) {
        callback(err);
        exit;
      } 
      if (videos && videos.length > 0) {
        var numVideosProcessed = 0;
        _.each(videos, function(video){
          var url = 'http://gdata.youtube.com/feeds/api/videos/' + video.youtubeId + '?v=2&alt=json&format=5';
          request({uri: url}, function(err, response, body){
              var self = this;
              self.items = new Array();
              if(err && response.statusCode !== 200){console.log('Request error.');}
              var data = JSON.parse(body);
              var numLikes = 0;
              var numDislikes = 0;
              if ( data.entry.yt$rating ){
                numLikes = data.entry.yt$rating.numLikes;
                numDislikes = data.entry.yt$rating.numDislikes;
              }
              var rankingValue = numLikes - numDislikes;
              video.title = data.entry.title.$t;
              video.thumbnail = data.entry.media$group.media$thumbnail[1].url;
              video.duration =  data.entry.media$group.yt$duration.seconds;
              video.ranking.numLikes = numLikes;
              video.ranking.numDislikes = numDislikes;
              video.ranking.value= rankingValue;
             
              Videos.update( {_id: video.id}, video, function(err,cb){
                if(err) {
                  callback(err);
                }
              });
              numVideosProcessed = numVideosProcessed + 1;
         
             if (numVideosProcessed === videos.length) {
              instructor.ranking = _.reduce( videos, function(memo, video){ return memo + video.ranking.value;}, 0);
              callback(instructor);
             }
          });
        });

      } else {
        instructor.ranking = 0;
        callback(instructor);
      }

    });
 }




