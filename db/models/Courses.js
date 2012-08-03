

/*
Modelo de un curso

*/

var CourseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  deleted: {type: Boolean, default: false},
  duration: String,

  // details: String,
});


var Courses = mongoose.model('Courses', CourseSchema);

module.exports = Courses;