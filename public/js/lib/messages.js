define([ 'core',  'hbs!./lib/message' ], 

function(Core, messageTmpl) {

  var codes = {
      u : { level :'info',  message :' updated' },
      s : { level :'info',  message :' saved' },
      d : { level :'info',  message :' deleted' },
      e : { level :'error', message :': Error while processing the request' }
  }

  return {
    getMessage : function(itemName, code, customMessage){
      var messageHTML   
        , messageText
    
      if (!code){
        code =  Core.getParamValue('code');
      }


      if (code){

        if (customMessage){
          messageText = customMessage;
        } else {
          messageText = itemName  + codes[code].message;
        }


        messageHTML =  messageTmpl({        
          type: codes[code].level,
          message : messageText
        });
      }
      return messageHTML;
    }
  }

});

