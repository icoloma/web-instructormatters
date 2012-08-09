
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
    expires: this.expires,
    admin: this.admin
  }
};

module.exports = Users;