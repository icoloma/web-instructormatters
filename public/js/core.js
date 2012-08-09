define([ 'jquery', 'underscore', 'backbone', 'bootstrap_alert', 'lib/messages', 'hbs!./lib/message'], 
  function($, _, Backbone, BootstrapAlert, Messages, messageTmpl) {
  
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

  // render any existing messages
  var messageKey = core.getParamValue('code');
  messageKey && core.renderMessage(Messages[messageKey]);

  return core;

  
  
})