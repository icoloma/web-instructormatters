

var ObjectId = mongoose.Schema.ObjectId;

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
  findCourseEditions: function(uuid, callback) {
    this
      .find({deleted: false, courseUUID: uuid})
      .sort('date', 'descending')
      .exec(callback);
  },
});

var Editions = mongoose.model('Editions', EditionSchema);


Editions.prototype.toJSON = function(){
  return {
    id: this._id,
    date: this.date,
    venue: this.venue,
    instructor: this.instructor,
    courseUUID: this.courseUUID,
    state: this.state
  }
};
 
module.exports = Editions;