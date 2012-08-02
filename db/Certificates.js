
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
});


var Certificates = mongoose.model('Certificates', CertificateSchema);

module.exports = Certificates;