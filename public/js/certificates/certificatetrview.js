define([ 'core', 'hbs!./certificateview' ], 
  function(Core, template) {
  
    return Backbone.View.extend({

      tagName: 'tr',

      events: {

       'click .deleteCertificate' : function(){
          this.model.destroy();
          this.remove();
        },
      
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },
      },

      render: function() {
        this.$el.html( template( {
            certificate: this.model.toJSON()
          })); 
        return this;
      },

    })

});