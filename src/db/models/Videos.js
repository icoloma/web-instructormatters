
var ObjectId = mongoose.Schema.ObjectId,
  wrapResult = require('./helpers').wrapResult,
  jsonResult = require('./helpers').jsonResult,
  errors = require(__apppath + '/src/routes/errorHandlers.js');

/*
Modelo de un video
*/

var VideoSchema = new mongoose.Schema({
  youtubeId: String,
  instructorId: {type: ObjectId, ref: 'Users'},
  instructorName: String,
  url: String,
  thumbnail: String,
  title: String,
  locale: String,
  courseUUID: String,
  ranking : {
    value : Number,
    numLikes : Number,
    numDislikes : Number,
  }
}, {strict: true});


_.extend(VideoSchema.statics, {
  findInstructorVideos: function (instructorId, callback) {
    this
      .find({instructorId: instructorId})
      .sort('ranking.value', 'descending')
      .exec(jsonResult(callback));
  },

  updateInstructorVideos: function(instructorId, body, callback) {
    // Videos
    //   .remove({instructorId: instructorId});
    async.forEachSeries(body, 
      function (video, cb) {
        if (video.id) {
          // update
          this
            .update({_id: video.id}, video)
            .exec(cb);
        } else {
          // create
          var video = new this(video);
          video.instructorId = instructorId;

          video.save(function (err) {
            cb(err);
          });
        }
      },
      callback
    );

  },

  findCourseVideos: function (courseUUID, numVideos, callback) {
    this
      .find({courseUUID: courseUUID})
      .sort('ranking.value', 'descending')
      .limit(numVideos)
      .exec(function (err, items) {
        if(err) {
          //TO DO error handling 'ligero'
          err = errors.codeError(500, 'Internal server error');
        }
        (jsonResult(callback))(err, items);
      });
  },

  deleteVideo: function (idVideo, callback) {
    this.remove({_id: idVideo}, callback);
  }
});

var Videos = mongoose.model('Videos', VideoSchema);

Videos.prototype.toJSON = function () {
  return {
    id: this._id.toString(),
    youtubeId: this.youtubeId,
    instructorId: this.instructorId.toString(),
    instructorName: this.instructorName,
    thumbnail: this.thumbnail,
    title: this.title,
    locale: this.locale,
    courseUUID: this.courseUUID,
    ranking: this.ranking,
  }
};

module.exports = Videos;