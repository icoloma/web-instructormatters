define([ 'core', 'certificates/certificatemodel' ], 
  function(K, CertificateModel) {

  return Backbone.Model.extend({
/*
    initialize: function() {
      this.certificates = new Backbone.Collection(this.get('certificates'), {
        model: CertificateModel
      });
    },
*/
    url: function() {
      return '/courses/' + this.get('courseUUID') + '/editions' + (this.id? '/' + this.id : '');
    }

/*
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      json.certificates = this.certificates.toJSON();
      return json;
    }

*/
  });

});