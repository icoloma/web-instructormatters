

var ObjectId = mongoose.Schema.ObjectId,
  wrapResult = require('./helpers').wrapResult,
  errors = require(__apppath + '/src/routes/errorHandlers.js');

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

  findAllUsers: function (callback) {
    this
      .find({deleted: false})
      .exec(wrapResult(callback));
  },

  findUser: function (userID, callback) {
    this.findById(userID, wrapResult(callback));
  },

  addUser: function (body, callback) {
    var self = this;
    this.findOne({email: body.email, deleted: false}, function (err, item) {
      if(err) {
        err = codeError(500, 'Internal server error');
        return callback(err, item);
      } else if(item) {
        err = codeError(500, 'A user with this email already exists')
        return callback(err, item);
      } else {
        var user = new self(body);
        user.save(function(err) {
          if(err) {
            err = errors.codeError(500, err.message);
          }
          callback(err, user._id.toString());
        });
      }
    });
  },

  updateUser: function (id, params, callback) {
    this.update({_id: id}, params, wrapResult(callback));
  },

  deleteUser: function (id, callback) {
    this.update({_id: id, deleted: false}, { $set: { deleted: true } }, wrapResult(callback));
  },

  /*
  * Listado de todos los instructores
  */
  findInstructors: function (queryOptions, callback) {
    // Los admins pueden ser instructores
    var query = _.extend({deleted: false, name: {$exists: true}}, queryOptions);
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