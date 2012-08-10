

var ObjectId = mongoose.Schema.ObjectId;

/*
Modelo de una edición de un curso

*/


var EditionSchema = new mongoose.Schema({
  date: {type: String, required: true},
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
    instructor: this.instructor,
    course: this.course
  }
};
 
module.exports = Editions;