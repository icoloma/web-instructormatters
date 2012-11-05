

var ObjectId = mongoose.Schema.ObjectId,
  wrapResult = require('./helpers').wrapResult,
  codeError = require(__apppath + '/src/routes/errorHandlers.js').codeError;

/*
Modelo de una edición de un curso
*/


var EditionSchema = new mongoose.Schema({
  date: {type: String, required: true},
  venue: {type: String, required: true},
  instructor: {type: ObjectId, ref: 'Users', required: true},
  courseUUID: {type: String, required: true},
  deleted: {type: Boolean, default: false},
  state: {type:String, default:'NEW'}   // values NEW | PENDING | PAID
}, {strict: true});


_.extend(EditionSchema.statics, {

  findEdition: function (editionID, callback) {
    this.findById(editionID, wrapResult(callback));
  },

  findCourseEditions: function (uuid, callback) {
    this
      .find({deleted: false, courseUUID: uuid})
      .sort('date', 'descending')
      .exec(wrapResult(callback));
  },

  saveEdition: function (body, callback) {
    var edition = new this(body);
    edition.save(function (err) {
      if(err) {
        err = codeError(500, 'Internal server error');
      }
      callback(err, edition._id);
    });
  },

  del: function (editionID, callback) {
    this.update({deleted: false, _id: editionID}, {$set: {deleted: true}}, wrapResult(callback));
  },

  updateEdition: function (editionID, body, callback) {
    this.update({_id: editionID, deleted: false}, body, wrapResult(callback));
  },

});

var Editions = mongoose.model('Editions', EditionSchema);


Editions.prototype.toJSON = function(){
  return {
    id: this._id.toString(),
    date: this.date,
    venue: this.venue,
    instructor: this.instructor,
    courseUUID: this.courseUUID,
    state: this.state
  }
};
 
module.exports = Editions;