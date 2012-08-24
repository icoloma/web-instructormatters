define([ 'core', 'certificates/certificatemodel' ], 
  
  function(K, CertificateModel) {
    return Backbone.Collection.extend({
        model: CertificateModel
      });
  }
);