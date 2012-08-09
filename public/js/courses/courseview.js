define([ 'core', 'backbone', 'hbs!./courseview' ], 
  function(Core, B, template) {

    return Backbone.View.extend({

      events: {
        'click #delete' : 'delete',
        'click #list' : 'list',
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      list : function() {
        window.location = this.model.urlRoot ;
      },

      render: function() {
        var edition = this.model.edition;
        this.$el.html( template( {
            course: this.model.toJSON()
          })); 
      },

      
      save: function(e) {
        var self = this;
        this.model.save({}, {
         
          success: function(resp, status, xhr) {
            window.location = self.model.url()  + "?code=updated";
          },

          error: function(resp, status, xhr){
            if (status.status === 201){   
              // Http status Ok, Created
              var location = status.getResponseHeader("location") + "?code=saved";
              window.location=location;              
            } else {
              Core.renderMessage({ level:'error', message: status.statusText});             
            }
          }
        });
        e.preventDefault();
      },

     
      delete: function(e){
        var self=this;
        this.model.destroy({
          success: function(resp, status, xhr) {
            window.location=self.model.urlRoot+ "?code=deleted";;
          },
          error: function(resp, status, xhr){
            Core.renderMessage({ level:'error', message:status.statusText});
          }
        });
        e.preventDefault();
      }

    })

});