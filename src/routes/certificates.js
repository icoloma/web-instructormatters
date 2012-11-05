
var models = require('../db/models') //TO DO borrar

var Certificates = require('../db/models').Certificates
  , Editions = require('../db/models').Editions
  , Pdfkit = require('pdfkit')
  , fs = require('fs')
  , UUID = require('../lib/uuid')
  , codeError = require('./errorHandlers.js').codeError;

/*
* Mostrar un certificado 
*/
exports.view = function (req, res) {

  res.format({
    html: function () {

       async.parallel([
        function (cb) {
          // find Course
          models.Courses.findOne({uuid:req.edition.courseUUID, deleted:false}, cb);
        }, function (cb) {
          // find instructor
          models.Users.findById(req.edition.instructor, cb);
        }], function (err, results) {
          // TODO: error handling
          res.render('public/certificate', {
            title: 'Certificate of training',
            certificate: req.certificate,
            edition: req.edition,
            course: results[0],
            instructor: results[1]
          });
        });

    },
    json: function(){
      res.json(certificate);
    }
  });
};


/*
* Certificados de una edición en concreto
*/
exports.list = function (req, res) {
  models.Certificates
    .find({edition:req.params.idEdition, deleted:false})
    .exec(function (err, items) {
      if(err) {
        codeError(500, err.message)
      } else {
        res.format({
          json: function(){
            res.json(items);
          }
        });
      };
    });
};

/**
  Crear/Actualizar Certificado
*/
  exports.save =  function (req, res) {

    req.setEncoding('utf8');

    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }

     //TODO: Comprobar que el estado es NEW, si no es así, devolver un código de error

       
    var certificates = req.body;

    async.forEachSeries( certificates, 
      function(certificate, callback){
        if (certificate.id){
          // update
          models.Certificates
          .update({_id: certificate.id}, certificate)
          .exec(callback);
        } else {
          // create
          var certificate = new models.Certificates(certificate);
          certificate.edition =  req.params.idEdition;
          certificate.uuid =  UUID.genV4();
          certificate.save(function (err) {
            callback(err);
          });

        }

      },
      function(err, num) {
        if (err) {
          codeError(500, err.message);
        }
        res.header('location',  '/courses/' + req.params.uuid + '/editions/' + req.params.idEdition );
        res.send(201);
       
    });
  };

  exports.del = function (req, res) {
    models.Certificates.update({_id: req.params.id}, {deleted: true}, function (err, num) {
      if(err) {
        codeError(500, err.message);
        return;
      } 
      if(!num) {
        codeError(404,'Certificate not found');  // not found
      } 
      res.send(204);  // OK, no content
    });
      
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
        models.Users.findById(req.edition.instructor, cb);
      }], function (err, results) {
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
    function (certificate, cb) {
      Editions.findEditions(certificate.edition, function (err, edition) {
        //if the edition's state is not paid, the certificate should not be available
        if(!err && edition && edition.state !== 'PAID') {
          err = codeError(404);
        }
        cb(err, certificate, edition);
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
    var doc = new Pdfkit({layout:'landscape'});

    //Register a font name for use later
    doc.registerFont('Palatino', 'fonts/PalatinoBold.ttf');

    doc
      .font('Palatino')
      .fontSize(15)
      .text('This is to certify that', 100, 100)
      .fontSize(25)
      .text(certificate.name,{align: 'center'})
      .moveDown()
      .fontSize(15)
      .text('is hereby recongized for having succesfully completed ')
      .fontSize(25)
      .text(course.name,{align: 'center'})
      .moveDown()
      .fontSize(15)
      .text('Instructor: ' + instructor.name)
      .text('Location: ' + edition.venue)
      .text('Date: ' + edition.date)
      .text('Duration: ' + course.duration)
      .text('URL: ' + urlCourse)  
      .fontSize(15)
      .moveDown()
      .moveDown()
      .text(urlCertificate);

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
      fs.statSync(d); 
      return true;
    } catch (er) { 
      return false; 
    }
}


