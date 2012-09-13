
var models = require('../db/models')
  , youtube  = require('../videos/youtube')

/*
* Listado de todos los instructores
*/
exports.list =  function (req, res) {
    models.Users
    .find({
      deleted: false,
      admin: false,
      name : { $exists: true}
    })
    .sort('name','ascending')
    .select('name id geopoint address oauth')
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){
              var json = JSON.stringify(items);
              res.render('public/instructors', {
                title: 'instructors',
                instructors: items,
                json: json
              });
            },
            json: function(){
              res.json(items);
            }
          });
        };
      }
    )
  };


/*
*Información pública del instructor
*/
exports.show =  function (req, res) {
    models.Users
    .find({
      _id: req.params.id,
      deleted: false,
      admin: false,
    })
    .select("id name address videos email oauth geopoint")
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
          res.format({
            html: function(){
              res.render('public/instructor', {
                title: 'instructor',
                instructor: items[0],
                geolocation: items[0].geopoint.lat + ',' +  items[0].geopoint.lng + '&z=' + items[0].geopoint.zoom
              });
            },
            json: function(){
              res.json(items);
            }
          });
        };
      }
    )
  };


/*
* Información para editar el instructor
*/
exports.view =  function (req, res) {
    models.Users
    .find({
      _id: req.params.id,
      deleted: false,
      admin: false,
    })
    .select("id name address email oauth videos geopoint")
    .exec( 
      function (err, items) {
        if(err) {
          console.log(err);
          res.send(500, err.message);
        } else {
         
          var instructor = items[0];
         
          res.format({
            html: function(){
              res.render('admin/instructor', {
                title: 'instructor',
                instructor: instructor.toJSON()
              });
            },
            json: function(){
              res.json(instructor);
            }
          });
        };
      }
    )
  };


/**
  Actualizar un instructor
*/
  exports.update = function (req, res) {
    if (!req.accepts('application/json')){
       res.send(406);  //  Not Acceptable
    }

    models.Users.update({_id: req.params.id}, req.body, function (err, num) {
      if(err) {
        console.log(err);
        res.send(500, err.message);
      } else if(!num) {
        res.send(404);   // not found
      } else {
        res.send(204);   // OK, no content
      }
    });
  };
 

 /* Top videos */
 exports.videos= function( req, res) {

   models.Users
    .find({
      deleted: false,
      admin: false,
      videos: { $exists : true }
    })
    .select("id name videos oauth")
    .exec( function( err, items){
      if(err) {
        console.log(err);
        res.send(500, err.message);
        return;
      } 
      var instructors = _.compact(_.map( items, function(instructor){
          var video = instructor.get('videos')[0];
          if (video){
            instructor.firstVideo = video;
            return instructor;
          }
      }));

      res.render('public/videos', 
        { title: 'videos',
          instructors: instructors
        });
    });

}


