var services = require('../db/models').services;

/*
  Home
*/
exports.home = function (req, res) {

  var now =  /(.+)T.+/.exec(new Date().toISOString());

  services.getFullCoursesList(now, 3, function (err, editions, courses) {
    if(err) return next(err);
    res.render('public/home', {
      title: 'Instructor Matters',
      courses: courses,
      editions: editions
    });
  });

}

/*
  Pricing
*/
exports.pricing = function (req, res) {
  res.render('public/pricing', {
   title: 'Pricing'
  });
}

exports.contactUsForm = function(req, res) {
  res.render('public/contact', {
    title: 'Contact',
    adressee: {name : 'Instructor Matters'}
  });
}



