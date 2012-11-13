
var ObjectId = mongoose.Schema.ObjectId;

var wrapResult = require('./helpers').wrapResult,
  wrapError = require('./helpers').wrapError,
  wrapJSON = require('./helpers').wrapJSON,
  codeError = require(__apppath + '/src/routes/errorHandlers').codeError,
  UUID = require('../../lib/uuid');

/*
Modelo de un certificado
*/

var CertificateSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  uuid: {type: String, required: true},
  company: String,
  edition: {type: ObjectId, ref: 'Editions', required: true},
  deleted: {type: Boolean, default: false},
}, {strict: true});


_.extend(CertificateSchema.statics, {
  findCertificate: function (certificateUUID, callback) {
    this.find({deleted: false, uuid: certificateUUID}, wrapResult(callback));
  },

  findEditionCertificates: function (editionID, callback) {
    this.find({deleted: false, edition: editionID}, wrapError(callback));
  },
  deleteCertificate: function (certificateID, callback) {
    this.update({_id: certificateID}, {$set: {deleted: true}}, wrapResult(callback));
  },
  updateCertificate: function (certificateID, data, callback) {
    this.update({_id: certificateID}, data, wrapResult(callback));
  },
  addCertificate: function (data, callback) {
    data.uuid = UUID.genV4();

    var  certificate = new this(data);
    certificate.save(wrapError(callback));
  }
});

var Certificates = mongoose.model('Certificates', CertificateSchema);

Certificates.prototype.toJSON = function(){
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    uuid: this.uuid,
    company: this.company,
    edition: this.edition
    // edition: {type: ObjectId, ref: 'Editions'},
  }
};

module.exports = Certificates;