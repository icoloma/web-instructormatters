define([ 'core' ], function() {
  
  return Backbone.Model.extend({

    //urlRoot : '/certificates',
     url: function() {
      return '/certificates' + (this.id? '/' + this.id : '');
    }
   

  })

});
