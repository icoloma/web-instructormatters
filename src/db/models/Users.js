

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
  googleId: String,
  admin: {type: Boolean, default: false},
  deleted: {type: Boolean, default: false},
  certificates: [ { uuid: {type: String}}],
  aboutMe : String,
  ranking: { type:Number, default: 0},
  address: String,
  geopoint : { 
    lat: Number,
    lng: Number
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
        self.normalizeBooleans(body);
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

  // hay que convertir de String a Boolean 
  normalizeBooleans: function(params){
    if (params.admin !== true) params.admin = (params.admin === "true");
 },

  updateUser: function (id, params, callback) {
    this.normalizeBooleans(params);
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
      .sort( 'ranking','descending')
      .select('name id geopoint address googleId certificates')
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
    aboutMe: this.aboutMe,
    email: this.email,
    googleId: this.googleId,
    expires: this.expires,
    admin: this.admin,
    ranking: this.ranking,
    courses: this.courses && this.courses.map(function (course) {
      return course;
    }),
    certificates: this.certificates && this.certificates.map(function (certificate) {
      return certificate
    }),
    address: this.address,
    geopoint: { 
      lat: this.geopoint.lat, 
      lng: this.geopoint.lng },
  }
};

module.exports = Users;