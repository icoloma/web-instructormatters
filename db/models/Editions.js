

var ObjectId = mongoose.Schema.ObjectId;

/*
Modelo de una edición de un curso

*/


var EditionSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  venue: {type: String, required: true},
  instructor: {type: ObjectId, ref: 'Users', required: true},
  course: {type: ObjectId, ref: 'Courses', required: true},
  deleted: {type: Boolean, default: false},
}, {strict: true});

var Editions = mongoose.model('Editions', EditionSchema);


Editions.prototype.toJSON = function(){
  return {
    id: this._id,
    date: this.date,
    venue: this.venue,
    instructorId: this.instructor._id,
    courseId: this.course._id
  }
};

module.exports = Editions;