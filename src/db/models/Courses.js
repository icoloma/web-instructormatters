
var wrapResult = require("../../routes/errorHandlers").wrapResult

/*
* Modelo de un curso
*/

var CourseSchema = new mongoose.Schema({
  uuid: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  duration: String, 
  deleted: {type: Boolean, default: false},   // private field
  description: String,
}, {strict: true});



_.extend(CourseSchema.statics, {

  /*
    Búsqueda de un curso
    Gestiona el envío de errores 404 y los 500
  */
  findCourseByUUID: function (uuid, callback) {
    this
    .findOne({uuid:uuid, deleted:false})
    .exec(wrapResult(callback));
  },

  del: function (uuid, callback) {
    this.update({uuid: uuid, deleted: false}, {deleted: true}, wrapResult(callback));
  },

  putCourse: function (json, uuid, callback) {
    var insertion = false;

    if (!json.id) {
      insertion = true // Inserción
      var course = new this(json);
      course.save(function (err) {
        if(err) {
          err = codeError(500, err.message.match(/E11000.+/) ? 'Course UUID already exists' : err.message);
        }
        callback(err, insertion);
      });
    } else {
      // actualizamos
      this.update({uuid: uuid}, json, wrapResult(callback));
    }
  }
});


var Courses = mongoose.model('Courses', CourseSchema);

Courses.prototype.toJSON = function(){
  return {
    id: this._id,
    uuid: this.uuid,
    name: this.name,
    duration: this.duration,
    description: this.description
  }
};



module.exports = Courses;