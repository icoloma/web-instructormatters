

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


var Users = mongoose.model('Users', UserSchema);

Users.prototype.toJSON = function(){
  return {
    id: this._id,
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