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
  res.render('public/contact', {
    title: 'Contact',
    adressee: {name : 'Instructor Matters'}
  });
}



