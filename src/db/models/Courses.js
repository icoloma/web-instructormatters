

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

/*
  Búsqueda de un curso
  Gestiona el envío de errores 404 y los 500
*/
CourseSchema.statics.findCourseByUUID = function (uuid, callback) {
  this
  .find({uuid:uuid, deleted:false})
  .exec(function (err, item) {
    if(err) {
      err = codeError(500, err.message)
    } else if(!item || item.length === 0 || item.deleted) {
      err = codeError(404,'Course not found');
    }
    callback(err, item);
  });
};

CourseSchema.statics.del = function (uuid, callback) {
  this.update({uuid: uuid, deleted: false}, {deleted: true}, function (err, num) {
    if(err) {
      err = codeError(500, err.message);
    }
    if(!num) {
      err = codeError(404, 'Not found');
    }
    callback(err);
  });
}

CourseSchema.statics.putCourse = function (json, uuid, callback) {
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
    this.update({uuid: uuid}, json, function (err, num) {
      if(err) {
        err = codeError(500, err.message);
      } else if(!num) {
        err = codeError(404,'Not found');   // not found
      }
      callback(err, insertion);
    });
  }
}

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