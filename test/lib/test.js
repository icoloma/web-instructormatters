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
    moment: 'lib/moment'
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
