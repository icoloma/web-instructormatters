define([ 'jquery', 'underscore', 'backbone', 'bootstrap_alert', 'lib/messages', 'hbs!./lib/message'], 
  function($, _, _unused, BootstrapAlert, Messages, messageTmpl) {
  
  window.B = Backbone;

  var core = {
    getParamValue: function (paramName) {
      /// <summary>
      ///     Get the value of input parameter from the querystring
      /// </summary>
      /// <param name="paramName" type="String">The input parameter whose value is to be extracted</param>
      /// <returns type="String">The value of input parameter from the querystring</returns>

      //parName = paramName.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      var pattern = '[\\?&]' + paramName + '=([^&#]*)';
      var regex = new RegExp(pattern);
      var matches = regex.exec(window.location.href);
      if (matches == null)
        return '';
      else 
        return decodeURIComponent(matches[1].replace(/\+/g, ' '));
    },
    /**
      Render any pending messages
      @param msg.level {String}
      @param msg.message {String}
      */
    renderMessage : function(msg){
      $('.messages-container').append(messageTmpl(msg));
    }

    
};

// Error handling for Ajax 
$(document).ajaxError(function(e, xhr, settings, exception) {
  if ( xhr.status == 201 && settings.on201){
    settings.on201(xhr)
  } else {
    //alert('error in: ' + settings.url + ' \n'+'error:\n' + xhr.responseText );
    core.renderMessage({ level:'error', message: xhr.responseText});  
  }
}); 

  
// render any existing messages
var messageKey = core.getParamValue('code');
messageKey && core.renderMessage(Messages[messageKey]);

return core;

  
  
})