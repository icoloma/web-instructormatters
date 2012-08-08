

/*
* Modelo de un curso
*/

var CourseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  duration: String, 
  deleted: {type: Boolean, default: false},   // private field
  description: String,
}, {strict: true});


var Courses = mongoose.model('Courses', CourseSchema);

Courses.prototype.toJSON = function(){
  return {
    id: this._id,
    name: this.name,
    duration: this.duration,
    description: this.description
  }
};

module.exports = Courses;