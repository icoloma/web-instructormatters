var Courses = require('./Courses'),
  Editions = require('./Editions'),
  Users = require('./Users'),
  Certificates = require('./Certificates');


var wrapResult = require('./helpers').wrapResult;


module.exports = {
  getFullCoursesList: function (date, limit, callback) {
    async.parallel([
      function (cb) {
        Editions
         .find( { deleted:false, "date" : { "$gte" : date } } )
         .sort('date','ascending')
         .limit(limit)
         .exec(cb);
      },
      function (cb) {
        Courses
          .find( {deleted:false })
          .sort('name', 'ascending')
          .exec(cb)    
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

  addCourseVideos: function (course, numUsers, numVideos, callback) {
    // Buscamos usuarios con videos del curso
    Users
      .find({
        deleted:false,
        "videos.courseUUID": course.uuid
        })
      .sort( 'videos.ranking.value','descending')
      .exec(function (error, users){
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
  },

  getInstructorFullInfo: function (instructorID, callback) {
    Users.findOne({deleted: false, _id: instructorID},
      wrapResult(function (err, instructor) {
        if(err) {
          callback(err, instructor);
        } else {
          async.map(instructor.courses,
            Courses.findCourseByUUID.bind(Courses),
            function (err, results) {
              instructor.coursesWithInfo = results;
              _.map(results, function(course){ course.certificated =  _.contains( instructor.certificates, course.uuid)  });
              callback(err, instructor);
            }
          );
        }
      }));
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