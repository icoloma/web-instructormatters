define([ 'core' ], function() {
  
  return Backbone.Model.extend({
    
    urlRoot : '/courses',
    idAttribute : 'uuid'
   
  })

});