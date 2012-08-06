
var ObjectId = mongoose.Schema.ObjectId;

/*
Modelo de un certificado
*/

var CertificateSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  uuid: {type: String, required: true},
  company: String,
  edition: {type: ObjectId, ref: 'Editions'},
  deleted: {type: Boolean, default: false},
}, {strict: true});


var Certificates = mongoose.model('Certificates', CertificateSchema);

Certificates.prototype.toJSON = function(){
  return {
    name: this.name,
    email: this.email,
    uuid: this.uuid,
    company: this.company,
    // edition: {type: ObjectId, ref: 'Editions'},
  }
};

module.exports = Certificates;