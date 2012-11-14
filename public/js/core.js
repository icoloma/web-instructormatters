define([ 'jquery', 'underscore', 'backbone', 'lib/messages', 'hbs!./lib/message', 'bootstrap_alert', 'bootstrap_dropdown', 'bootstrap_collapse'], 
  function($, Underscore, _unused, Messages, messageTmpl) {
  
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
    renderMessage : function(msg, container){
      if (!container){
        container = '.messages-container';
      }
      $(container).append(messageTmpl(msg));
    },

    /** assertions */
    assert: function(exp, message) {
      var AssertException = function(message) { this.message = message; }
      AssertException.prototype.toString = function () {
        return 'AssertException: ' + this.message;
      }
      if (!exp) {
        throw new AssertException(message || 'assertion failed');
      }
    }
    
};

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g,
  escape      : /\{\{-(.+?)\}\}/g,
  evaluate: /<%([\s\S]+?)%>/g // no la usamos, pero underscore la tiene por ahi
};

// Error handling for Ajax 
$(document).ajaxError(function(e, xhr, settings, exception) {
  if ( xhr.status == 201 && settings.on201){
    settings.on201(xhr)
  } else if ( xhr.status == 0 ) {
     core.renderMessage({ level:'error', message: 'Connection timeout'});  
  }  else {
    //alert('error in: ' + settings.url + ' \n'+'error:\n' + xhr.responseText );
    core.renderMessage({ level:'error', message: xhr.responseText});  
  }
}); 

  
// render any existing messages
var messageKey = core.getParamValue('code');
messageKey && core.renderMessage(Messages[messageKey]);

return core;

  
})