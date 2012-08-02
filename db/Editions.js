

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
});

var Editions = mongoose.model('Editions', EditionSchema);

module.exports = Editions;