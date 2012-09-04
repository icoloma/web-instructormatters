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

/*
  Contact
*/
exports.contactUs = function (req, res) {
  res.render('public/contactUs', {
   title: 'Contact Us'
  });
}




