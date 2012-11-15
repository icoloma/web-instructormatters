define(['core'], 
  function(Core) {
    return B.Model.extend({
      
      url: function() {
        return this.attributes.url ? this.attributes.url  : '/contact';
      }

    });
  }
);