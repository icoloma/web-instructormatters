
var ObjectId = mongoose.Schema.ObjectId,
  wrapError = require('./helpers').wrapError,
  wrapJSON = require('./helpers').wrapJSON,
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
  duration: Number,
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
      .exec(wrapError(callback));
  },

  updateInstructorVideos: function(instructorId, videos, callback) {
    if (videos.length > 3) {
      callback(errors.codeError(400,'Only 3 videos are allowed'), 0);
      return;
    }
    
    var self = this;
    async.forEachSeries(videos, 
      function (video, cb) {
        if (video.id) {
          // update
          self
            .update({_id: video.id}, video)
            .exec(cb);
        } else {
          // create
          var video = new self(video);
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
        (wrapError(callback))(err, items);
      });
  },

  deleteVideo: function (idVideo, callback) {
    this.remove({_id: idVideo}, callback);
  },

});

var Videos = mongoose.model('Videos', VideoSchema);

Videos.prototype.toJSON = function () {
  return {
    id: this._id.toString(),
    youtubeId: this.youtubeId,
    url: this.url,
    instructorId: this.instructorId.toString(),
    instructorName: this.instructorName,
    thumbnail: this.thumbnail,
    title: this.title,
    locale: this.locale,
    courseUUID: this.courseUUID,
    duration:this.duration,
    ranking : this.ranking && {
      value : this.ranking.value && this.ranking.value.toString(),
      numLikes : this.ranking.numLikes && this.ranking.numLikes.toString(),
      numDislikes : this.ranking.numDislikes && this.ranking.numDislikes.toString(),
    }
  }
};

module.exports = Videos;