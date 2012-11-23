
var models = require('../db/models') //TO DO borrar

var Certificates = require('../db/models').Certificates
  , Editions = require('../db/models').Editions
  , Courses = require('../db/models').Courses
  , Users = require('../db/models').Users
  , Pdfkit = require('pdfkit')
  , fs = require('fs')
  , UUID = require('../lib/uuid')
  , codeError = require('./errorHandlers.js').codeError
  , localizeDates = require('../db/models/helpers').localizeDates
  , sendCertificate = require('../mailer/setup').sendCertificate;


/*
* Certificados de una edición en concreto
*/
exports.list = function (req, res, next) {
  Certificates.findEditionCertificates(req.params.idEdition, function (err, certificates) {
    if(err) return next(err);
    res.json(certificates);
  });
};

/**
  Crear/Actualizar Certificado
*/
exports.save =  function (req, res, next) {

  req.setEncoding('utf8');

  if (!req.accepts('application/json')){
    res.send(406);  //  Not Acceptable
  }

  //TODO: Comprobar que el estado es NEW, si no es así, devolver un código de error

  var certificates = req.body;

  async.forEachSeries(certificates, 
    function (certificate, callback) {
      if (certificate.id) {
        // update
        Certificates.updateCertificate(certificate.id, certificate, callback);
      } else {
        // create
        certificate.edition = req.params.idEdition;
        Certificates.addCertificate(certificate, callback);
      }
    },
    function (err) {
      if (err) return next(err);
      res.header('location',  '/courses/' + req.params.uuid + '/editions/' + req.params.idEdition );
      res.send(201);
  });
};

exports.del = function (req, res) {
  Certificates.deleteCertificate(req.params.id, function (err, num) {
    if(err) return next(err);
    res.send(204);  // OK, no content
  });
}

exports.send = function(req, res, next) {
  var certificates = req.body.certificateUUID;
  if (!certificates){
   res.redirect('/courses/' + req.params.uuid + '/editions/' + req.params.idEdition ); 
   return;
  }
  if (certificates.constructor === String) {
   certificates = [ certificates ];
  } 

  var sentMail = 0;
  _.each(certificates, function(certificateUUID){
    Certificates.findCertificate(certificateUUID, function(err, certificate){
      if (err) { 
        console.log("Error finding certificate: " + certificateUUID);
        return next(err)
      };
      sendCertificate(certificate[0], function(err,status){
        if (err) {
          return next(err)
        }
        sentMail = sentMail +1;
        if (sentMail === certificates.length){
          res.redirect('/courses/' + req.params.uuid + '/editions/' + req.params.idEdition +'/#mailSent');
        }
      });
    });
  },this)
}




exports.pdf = function( req, res ){
   
  var filename = 'certificates/' + req.params.uuid + '.pdf';
  
  if (fileExists(filename)){
      res.sendfile(filename);
      return;
  }

  async.parallel([
    function (cb) {
      // find Course
      models.Courses.findOne({uuid:req.edition.courseUUID, deleted:false}, cb);
    }, function (cb) {
      // find instructor
      models.Users.findById(req.edition.instructorId, cb);
    }
    ], 
    function (err, results) {
      // TODO: error handling
      var course = results[0];
      var instructor = results[1];
      generatePDF( req.certificate, req.edition, course, instructor, function(err) {
        if (!err) {
          res.sendfile(filename);
        } else {
          codeError(500, err);
        }
      });
  });
},

exports.checkAvailability = function (req, res, next) {
  async.waterfall([
    function (cb) {
      Certificates.findCertificate(req.params.uuid, cb)
    },
    function (certificates, cb) {
      Editions.findEdition(certificates[0].edition, function (err, edition) {
        //if the edition's state is not paid, the certificate should not be available
        if(err ||  ( !res.locals.isAdmin && edition && edition.state !== 'PAID')) {
          err = codeError(404);
        }
        cb(err, certificates[0], edition);
      });
    }
    ],
    function (err, certificate, edition) {
      if(err) return next(err);

      req.certificate = certificate;
      req.edition = edition;
      return next();
    }
  );
};

  var generatePDF = function (certificate, edition, course, instructor, callback){
    var urlCertificate = 'http://instructormatters.com/certificates/' + certificate.uuid;
    var urlCourse = 'http://instructormatters.com/courses/' + course.uuid;
    var doc = new Pdfkit({layout:'landscape', size:[ 572,794]});

    //Register a font name for use later

    var editionDate = new Date(edition.date);
    var dateString =  /.+,(.+,.+)/.exec(editionDate.toLocaleDateString())[1];

    var FONT_BIG = 32;
    var FONT_NORMAL = 18;
    var FONT_LITTLE = 14;
    var FONT_SMALL = 12;

    var nameFontSize = (certificate.name.length > 39) ? FONT_NORMAL: FONT_BIG;
    var courseFontSize = (course.name.length > 39) ? FONT_NORMAL: FONT_BIG;
    var addressSize = (edition.address.length > 30) ? FONT_LITTLE: FONT_NORMAL
   
    doc.registerFont('MyriadProRegular', 'resources/fonts/mpr.ttf');
    doc.registerFont('MyriadProCondRegular', 'resources/fonts/mpc.ttf');
    doc.registerFont('MyriadProBold', 'resources/fonts/MyriadPro-Bold.ttf');
    doc.registerFont('MyriadProCondBold', 'resources/fonts/MyriadPro-BoldCond.ttf');

    doc
      // background
      .image('resources/img/bg.png', 2 ,3,  {width: 790, height: 565})

      // Header
      .font('MyriadProCondBold').fontSize(FONT_BIG)
      .text(' ', 0, 88, {align:'center'})
      .text('InstructorMatters', {align: 'center'})
      .font('MyriadProRegular').fontSize(FONT_NORMAL).text('certifies that', {align: 'center'})

      .font('MyriadProBold').fontSize(nameFontSize);

    if (nameFontSize === FONT_NORMAL){
        doc.moveDown(0.5);
    }

    doc
      // Student name
      .text( certificate.name, {align: 'center'})
      .font('MyriadProRegular').fontSize(FONT_NORMAL)
      .text(' ', 0, 200 , {align:'center'})

      // duration
      .text('has successfully completed the ' + course.duration + ' course', {align: 'center'})
      .font('MyriadProBold').fontSize(courseFontSize);

    if (courseFontSize === FONT_NORMAL){
        doc.moveDown(0.5);
    }

    doc  
      // course 
      .text( course.name, {align: 'center'})
      .font('MyriadProRegular').fontSize(FONT_NORMAL)
      .moveDown()
      // instructor
      .text(' ', 0, 290 , {align:'center'})
      .text('delivered by', {align: 'center'})
      .font('MyriadProBold').text(instructor.name , {align: 'center'})
      // address
      .font('MyriadProRegular').fontSize(addressSize).text('in ' + edition.address , {align: 'center'})
      // date
      .font('MyriadProRegular').fontSize(FONT_NORMAL)
      .text('on ' + dateString , {align: 'center'})

      // link
      .text(' ', 0, 455, {align: 'center'})
      .font('MyriadProRegular').fontSize(FONT_SMALL)
      .text(urlCertificate, {align: 'center'})
   ;
     
    async.series([
      function(cb){
        doc.write('certificates/' + certificate.uuid + '.pdf', cb);
      }], function(err, results){
        callback(err,results);
      }
      );
  }

  var fileExists = function (path) {
    try { 
      fs.statSync(path); 
      return true;
    } catch (er) { 
      return false; 
    }
}




