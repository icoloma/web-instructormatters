/*
  Add test features
*/

var __homeFolder = location.href.replace(/\/test\/.+/, '');
var moduleName = /\/(.+)-test/.exec(location.href)[1];

var require = {
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    moment: 'lib/moment',
    hbs: 'lib/hbs',
    Handlebars: 'lib/Handlebars',
    bootstrap_alert: 'lib/bootstrap-alert',
    messages: 'lib/messages'
  },
  deps: [
    // para que todos los tests puedan invocarlos desde el cuerpo del fichero html
    'lib/test-features.js'
  ],
  priority: [
    'core'
  ],
  baseUrl: __homeFolder + '/public/js'
};
