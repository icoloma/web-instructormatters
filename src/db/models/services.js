
var Courses = require('./Courses'),
  Editions = require('./Editions'),
  Users = require('./Users'),
  Videos = require('./Videos'),
  Certificates = require('./Certificates');

var wrapResult = require('./helpers').wrapResult,
  wrapError = require('./helpers').wrapError,
  wrapJSON = require('./helpers').wrapJSON,
  googleMapURL = require('./helpers').googleMapURL,
  localizeDates = require('./helpers').localizeDates;


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
         .exec(wrapError(cb));
      },
      function (cb) {
        Courses
          .find( {deleted:false })
          .sort('name', 'ascending')
          .exec(wrapError(cb))    
      }],
      function (err, items) {
        if(err) {
          callback(err, items)
          return;
        }

        var editions = items[0]
          , courses = items[1]
          , coursesMap = {}

        localizeDates(editions);
    
        courses.forEach(function (course) {
          coursesMap[course.uuid] = {name: course.name, description: course.description, uuid: course.uuid};
        })

        _.each( editions, function (edition) { 
          edition.course = coursesMap[edition.courseUUID]; 
          edition.googleMapURL= googleMapURL(edition);
        });

        callback(null, editions, courses);
    });
  },

  addCourseVideos: function (course, numVideos, callback) {
    Videos
      .find({courseUUID: course.uuid})
      .sort( 'ranking.value','descending')
      .limit(numVideos)
      .exec(
          wrapError(function (err, videos) {
          course.videos = videos
          callback(err);
        })
      );
  },

  getInstructorFullInfo: function (instructorID, callback) {
    async.parallel([
      function (cb) {
        Videos
          .find({instructorId: instructorID})
          .sort('ranking.value', 'descending')
          .exec(wrapError(cb));
      },
      function (cb) {
        Users
          .findOne({deleted: false, _id: instructorID})
          .exec(wrapResult(cb));
      }
      ],
      function (err, results) {
        if(err) {
          return callback(err, results);
        } else {

          var instructor = results[1];
          instructor.videos = results[0];

          async.map(instructor.courses,
            function (uuid, cb) {
              Courses.findCourseByUUID(uuid, cb)
            },
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
         .sort('date','descending')
         .exec(wrapError(cb));
      },
      function(cb){
        Courses
          .find( {deleted:false })
          .select( "name description uuid")
          .exec(wrapError(cb))    
      }
      ],
      function (err, items) {
        if(err) {
          return callback(err, items);
        }

        var editions = items[0]
          , courses = items[1]
          , coursesMap = {}

        localizeDates(editions);
        
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