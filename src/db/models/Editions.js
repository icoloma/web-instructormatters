

var ObjectId = mongoose.Schema.ObjectId,
  wrapResult = require('./helpers').wrapResult,
  wrapJSON = require('./helpers').wrapJSON,
  codeError = require(__apppath + '/src/routes/errorHandlers.js').codeError;

/*
Modelo de una edición de un curso
*/


var EditionSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  address: {type: String, required: true},
  geopoint : { 
    lat: Number,
    lng: Number,
    zoom: Number
   },
  instructor: {type: ObjectId, ref: 'Users', required: true},
  instructorName : String,   // Saved when creating 
  courseUUID: {type: String, required: true},
  deleted: {type: Boolean, default: false},
  state: {type:String, default:'NEW'}   // values NEW | PENDING | PAID
}, {strict: true});


_.extend(EditionSchema.statics, {

  findEdition: function (editionID, callback) {
    this.findById(editionID, wrapResult(callback));
  },

  findCourseEditions: function (uuid, numEditions, callback) {
    this
      .find({deleted: false, courseUUID: uuid})
      .sort('date', 'descending')
      .limit(numEditions)
      .exec(wrapJSON(callback));
  },

  findEditionInstructor: function (editionID, callback) {
    this
      .findById(editionID)
      .where('deleted').equals(false)
      .select('instructor')
      .populate('instructor')
      .exec(callback);
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
    date: this.date.toLocaleDateString(),
    instructor: this.instructor.toString(),
    courseUUID: this.courseUUID,
    state: this.state,
    address: this.address,
    geopoint: { 
      lat: this.geopoint.lat, 
      lng: this.geopoint.lng, 
      zoom: this.geopoint.zoom }
  }
};
 
module.exports = Editions;