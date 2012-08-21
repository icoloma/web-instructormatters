define([ 'core', 'certificates/certificatemodel' ], 
  function(K, CertificateModel) {

  return Backbone.Model.extend({

    urlRoot : '/admin/editions',

    initialize: function() {
      this.certificates = new Backbone.Collection(this.get('certificates'), {
        model: CertificateModel
      });
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      json.certificates = this.certificates.toJSON();
      return json;
    }

  });

});