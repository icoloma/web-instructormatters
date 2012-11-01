

var ObjectId = mongoose.Schema.ObjectId,
  wrapResult = require('./helpers').wrapResult;

/*
Modelo de un usuario

Nombre
Email
Fecha de expiracion
Token OAuth
Flag de administrador

*/

var UserSchema = new mongoose.Schema({
  name: String,
  email: {type: String, required: true},
  courses: [ { uuid: {type: String}}],
  expires: Date,
  oauth: String,
  admin: {type: Boolean, default: false},
  deleted: {type: Boolean, default: false},
  videos: [{ 
    id: String,
    url: String,
    thumbnail: String,
    title: String,
    locale: String,
    courseUUID: String
   }],
  address: String,
  geopoint : { 
    lat: Number,
    lng: Number,
    zoom: Number
   },
  
}, {strict: true});

_.extend(UserSchema.statics, {

  /*
  * Listado de todos los instructores
  */
  findInstructors: function (courseUUID, callback) {
    var query = {
      deleted: false,
      admin: false,
      name : { $exists: true}
    };
    if (courseUUID){
      query.courses = courseUUID;
    }
    this
      .find(query)
      .sort('name','ascending')
      .select('name id geopoint address oauth')
      .exec(wrapResult(callback))
  },

  updateInstructor: function (instructorID, params, callback) {
    //TO DO: ¿admin: false en la busqueda?
    this.update({_id: instructorID, deleted: false}, params, wrapResult(callback));
  },
});

var Users = mongoose.model('Users', UserSchema);

Users.prototype.toJSON = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    oauth: this.oauth,
    expires: this.expires,
    admin: this.admin,
    courses:this.courses,
    videos: this.videos,
    address: this.address,
    geopoint: { 
      lat: this.geopoint.lat, 
      lng: this.geopoint.lng, 
      zoom: this.geopoint.zoom }
  }
};

module.exports = Users;