define([ 'jquery', 'core', 'lib/qunit-git.js'], function(jq, co, qu) {
	
	$('head').append($('<title>' + moduleName + '</title>'));
	$('head').append($('<link rel="stylesheet" href="' + __homeFolder + '/public/stylesheets/style.css">'));
	$('head').append($('<link rel="stylesheet" href="' + __homeFolder + '/public/stylesheets/bootstrap.css">'));
	$('head').append($('<link rel="stylesheet" href="' + __homeFolder + '/test/lib/qunit-git.css">'));

	// add qunit results container
	$('body').append('<div id="qunit-testrunner-toolbar"></div> <h2 id="qunit-userAgent"></h2> <ol id="qunit-tests"></ol>');
	$('body').append('<div id="qunit-testresult"></div>');


	// define Test object
	/*
	window.Test = {
		//addStyleSheet: addStyleSheet,
		mockjax: mockjax
	}
	*/

});