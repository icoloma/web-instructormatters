define([ 'hbs!./message' ], 
  function( messageTmpl) {
  
  return codes = {
      updated : { level :'success',  message :'Item updated' },
      saved   : { level :'info',  message :'Item saved' },
      deleted : { level :'warn',  message :'Item deleted successfully' },
      error   : { level :'error', message :'Error while processing your request' }
  }

});

