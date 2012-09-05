/*
  Home
*/
exports.home = function (req, res) {
	res.render('public/home', {
	 title: 'Instructor Matters'
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
  res.render('public/contactUs', {
    title: 'Contact Us',
    adressee: {name : 'Instructor Matters', email:'info@extrema-sistemas.com'}
  });
}



