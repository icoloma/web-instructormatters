
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
});

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;