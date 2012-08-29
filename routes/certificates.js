
var models = require('../db/models');
var Pdfkit = require('pdfkit');
var fs = require('fs');

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
        res.send(500, err.message)
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
          console.log(err);
          res.send(500, err.message);
          return;  
        }
        res.header('location',  '/courses/' + req.params.uuid + '/editions/' + req.params.idEdition );
        res.send(201);
       
    });
  };

  exports.del = function (req, res) {
    models.Certificates.update({_id: req.params.id}, {deleted: true}, function (err, num) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
        return;
      } 
      if(!num) {
        res.send(404);  // not found
        return;
      } 
      res.send(204);  // OK, no content
    });
      
  }

  exports.pdf = function( req, resp ){
     
    var filename = 'certificates/' + req.params.uuid + '.pdf';
    
    try {
      fs.statSync(filename);
      resp.sendfile(filename);
      return;
    } catch(err){
      if (err.code ==='ENOENT'){
        async.parallel([
          function(callback){
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
                  this.generatePDF( req.certificate, req.edition, course, instructor, callback);
                });
          }

        ], function(err,results){
          if (!err){
            resp.sendfile(filename);
          } else{
            resp.send(500,err);
          }

        });
     
      } else {
        resp.send(500,err);
      }
    }


  },

  exports.checkAvailability = function(req, res, next) {
    models.Certificates
    .findOne({uuid:req.params.uuid, deleted:false})
    .exec(function (err, certificate) {
      if(err) {
        res.send(500, err.message)
      } else if(!certificate) {
        res.send(404);
      } else {
        models.Editions.findById(certificate.edition, function(err, edition) {
          if (err || !edition || edition.state != 'PAID') {
            //if the edition's state is not paid, the certificate should not be available
            res.send(404);
          } else {
            //make available to the next callbacks the certificate & edition through request
            req.certificate = certificate;
            req.edition = edition;
            return next();
          }
        });
      };
    });
  }

  generatePDF = function (certificate, edition, course, instructor, callback){
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
      .text(urlCertificate)
      .write('certificates/' + certificate.uuid + '.pdf', callback);
  }


