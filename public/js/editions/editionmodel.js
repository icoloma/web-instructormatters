define([ 'core', 'certificates/certificatemodel' ], 
  function(K, CertificateModel) {

  return Backbone.Model.extend({
    url: function() {
      return '/courses/' + this.get('courseUUID') + '/editions' + (this.id? '/' + this.id : '');
    }

  });

});