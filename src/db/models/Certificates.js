
var ObjectId = mongoose.Schema.ObjectId;

var wrapResult = require('./helpers').wrapResult,
  jsonResult = require('./helpers').jsonResult,
  codeError = require(__apppath + '/src/routes/errorHandlers').codeError;

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
    //Este método no lanza 404

    this.find({deleted: false, edition: editionID}, function (err, results) {
      if(err) {
        err = codeError(500, err.message);
      }
      callback(err, jsonResult(results));
    });
  },


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