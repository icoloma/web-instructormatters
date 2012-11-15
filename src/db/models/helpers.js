var error = require(__apppath + '/src/routes/errorHandlers.js');

var codeError = error.codeError,
  internalErrorHandler = error.internalErrorHandler,
  resultsErrorHandler = error.resultsErrorHandler;


var wrapJSON = function (result) {
  if(result.map) {
    return result.map(function (item) {
      return item.toJSON();
    });
  } else if(result.toJSON) {
    return result.toJSON();
  }
};


//Todos los wrappers convierten a JSON
module.exports = {
  wrapResult: function (callback) {

    return function (err, result) {
      if(err) {
        err = internalErrorHandler(err);
      } else {
        err = resultsErrorHandler(result);
        if(!err) {
          result = wrapJSON(result);
        }
      }
      callback(err, result);
    };
  },

  //Solo comprueba errores internos, no la falta de resultados
  wrapError: function (callback) {
    return function (err, result) {
      if(err) {
        err = internalErrorHandler(err);
      } else {
        result = wrapJSON(result);
      }
      callback(err, result);
    };
  },

  wrapJSON: function (callback) {
    return function (err, result) {
      callback(err, wrapJSON(result));
    }
  },

  localizeDates : function(editions) {
    _.map(editions, function(edition){
      edition.date =new Date( /(.+)T.+/.exec(edition.date)[1]).toLocaleDateString();
    });
  }

}