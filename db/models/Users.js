

var ObjectId = mongoose.Schema.ObjectId;
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
}, {strict: true});


var Users = mongoose.model('Users', UserSchema);

Users.prototype.toJSON = function(){
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    oauth: this.oauth,
    expires: this.expires,
    admin: this.admin,
    courses:this.courses
  }
};

module.exports = Users;