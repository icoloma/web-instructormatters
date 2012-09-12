define([ 'core' ], function() {
  
  return Backbone.Model.extend({
    
    urlRoot : '/instructors',
   
    initialize: function() {
      this.videos = new B.Collection(this.get('videos'));
    },

    toJSON: function()  {
      var json = B.Model.prototype.toJSON.call(this);
      json.videos = this.videos.toJSON();
      return json;
    }

  })

});