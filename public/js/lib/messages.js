define([ 'core',  'hbs!./lib/message' ], 

function(Core, messageTmpl) {

  var codes = {
      u : { level :'info',  message :'Item updated' },
      s : { level :'info',  message :'Item saved' },
      d : { level :'info',  message :'Item deleted' },
      e : { level :'error', message :'Error while processing the request' }
  }

  return {
    getMessage : function(code){
      var message
    
      if (!code){
        code =  Core.getParamValue('code');
      }

      if (code){
        message =  messageTmpl({        
          type: codes[code].level,
          message : codes[code].message
        });
      }
      return message;
    }
  }

});

