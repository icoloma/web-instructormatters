
var Courses = require('./Courses'),
  Editions = require('./Editions'),
  Users = require('./Users'),
  Videos = require('./Videos'),
  Certificates = require('./Certificates');


var wrapResult = require('./helpers').wrapResult,
  jsonResult = require('./helpers').jsonResult;


module.exports = {
  getFullCoursesList: function (date, limit, callback) {
    async.parallel([
      function (cb) {
        Editions
         .find( { deleted:false, 
                //  "state": "NEW",
                 "date" : { "$gte" : date } } )
         .sort('date','ascending')
         .limit(limit)
         .exec(jsonResult(cb));
      },
      function (cb) {
        Courses
          .find( {deleted:false })
          .sort('name', 'ascending')
          .exec(jsonResult(cb))    
      }],
      function (err, items) {
        if(err) {
          callback(err, items)
          return;
        }

        var editions = items[0]
          , courses = items[1]
          , coursesMap = {}

        courses.forEach(function (course) {
          coursesMap[course.uuid] = {name: course.name, description: course.description, uuid: course.uuid};
        })

        _.each( editions, function (edition) { 
          edition.course = coursesMap[edition.courseUUID]; 
        });

        callback(null, editions, courses);
    });
  },

  addCourseVideos: function (course, numVideos, callback) {

    Videos
      .find({courseUUID: course.uuid})
      .sort( 'ranking.value','descending')
      .limit(numVideos)
      .exec(function (err, videos) {
        course.videos = videos
        callback(err);
      });

    // // Buscamos usuarios con videos del curso
    // Users
    //   .find({
    //     deleted:false,
    //     "videos.courseUUID": course.uuid
    //     })
    //   .sort( 'videos.ranking.value','descending')
    //   .exec(function (error, users){
    //     users = _.first(users,numUsers);
    //     // extraemos solo los videos del curso
    //     course.videos = _.map(users, 
    //         function(user){
    //           return _.first(_.compact(_.map(user.videos, 
    //             function(video){ 
    //               if (course.uuid === video.courseUUID){
    //                 video.user ={};
    //                 video.user.name=user.name;
    //                 video.user.id=user.id
    //                 return video;
    //               }
    //             }
    //           )),numVideos);      
    //         });
    //     callback(null,course);
    //   });
  },

  getInstructorFullInfo: function (instructorID, callback) {
    async.parallel([
      function (cb) {
        Videos
          .find({instructorId: instructorID})
          .sort('ranking.value', 'descending')
          .exec(jsonResult(cb));
      },
      function (cb) {
        Users
          .findOne({deleted: false, _id: instructorID})
          .exec(wrapResult(cb));
      }
      ],
      function (err, results) {
        if(err) {
          callback(err, results);
        } else {

          var instructor = results[1];
          instructor.videos = results[0];

          async.map(instructor.courses,
            Courses.findCourseByUUID.bind(Courses),

            function (err, fullCourses) {
              _.map(fullCourses,
                function (course) {
                  course.certified =  _.contains( instructor.certificates, course.uuid)
              });

              instructor.coursesWithInfo = fullCourses;
              callback(err, instructor);
            }
          );
        }
      });
  },
  /*
    Retornamos las ediciones junto con el nombre del curso
  */
  getEditionsFullInfo: function (queryOptions, callback) {
    var query = _.extend({deleted: false}, queryOptions);

    async.parallel([
      function(cb){
        Editions
         .find( query )
         .sort('date','ascending')
         .exec(cb);
      },
      function(cb){
        Courses
          .find( {deleted:false })
          .select( "name description uuid")
          .exec(cb)    
      }
      ],
      function (err, items) {
        if(err) {
          err = codeError(500, err.message || 'Internal server error');
          return callback(err, items);
        }

        var editions = items[0]
          , courses = items[1]
          , coursesMap = {}

        courses.forEach(function (course) {
          coursesMap[course.uuid] = {
            name: course.name,
            description: course.description
          };
        });

        _.each( editions, function (edition) { 
          edition.course = coursesMap[edition.courseUUID]; 
        });
        callback(null, editions);
      }
    );
  },
}