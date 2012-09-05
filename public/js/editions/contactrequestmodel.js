define(['core'], 
  function(Core) {
    return B.Model.extend({
      
      url: function() {
        return this.get('editionId') ? this.get('editionId') + '/contact' : '/contactUs';
      }

    });
  }
);