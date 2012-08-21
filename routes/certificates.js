
var models = require('../db/models');


/*
  Añadir edición - ventana 
*/
exports.add = function(req,res){
  models.Editions.findById(req.params.idEdition, function (err, edition) {

   async.parallel([

    function (cb) {
      // find Course
      models.Courses.findById(edition.course, cb);
    }, function (cb) {
      // find instructor
      models.Users.findById(edition.instructor, cb);
    }], function (err, results) {
      // TODO: error handling
    
      res.render('admin/certificate', {
        title: 'Certificate',
        certificate: {},
        edition :edition,
        course: results[0],
        instructor: results[1]
      });

    });
  });
};

/**
  Crear Certificado
*/
  exports.create =  function (req, res) {

    if (!req.accepts('application/json')){
      res.send(406);  //  Not Acceptable
    }
    var certificate = new models.Certificates(req.body);
    
    // TODO: Generar un uuid automáticamente
    certificate.uuid = "1";
    certificate.edition =  /.*\/editions\/(.*)\/certificates.*/.exec(req.url)[1];

    certificate.save(function (err) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else {
        res.header('location',  req.url + '/' + this.emitted.complete[0]._id);
        res.send(201);

      }
    });
  };


  /*
* Mostrar un certificado
*/
exports.view = function (req, res) {
  models.Certificates.findById(req.params.id, function (err, item) {
    if(err) {
      res.send(500, err.message)
    } else if(!item || (item && item.deleted)) {
      res.send(404);
    } else {
      res.format({
        html: function () {

          models.Editions.findById(req.params.idEdition, function (err, edition) {

             async.parallel([

              function (cb) {
                // find Course
                models.Courses.findById(edition.course, cb);
              }, function (cb) {
                // find instructor
                models.Users.findById(edition.instructor, cb);
              }, function (cb) {
                // find certificates
                models.Certificates
                  .find({edition: edition})
                  .exec(cb);
              }], function (err, results) {
                // TODO: error handling

                console.log(results);
              
                res.render('admin/certificate', {
                  title: 'Certificate',
                  certificate: item,
                  edition :edition,
                  course: results[0],
                  instructor: results[1],
                  certificates: results[2]
                });

              });
            });
        },
        json: function(){
          res.json(item);
        }
      });
    };
  });
};

