define([ 'core', 'hbs!./certificateview' ], 
  function(Core, template) {
  
    return Backbone.View.extend({

      events: {
        'click #delete' : 'delete',
        'click #list' : 'list',
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },
      },

      delete : function(){

      },

      list : function(evt) {
        window.location = /(.*)\/certificates\/.*/.exec(window.location.href)[1];
      },

      // initialize: function() {},

      render: function() {
        var certificate = this.model.edition;
        this.$el.html( template( {
            certificate: this.model.toJSON(),
            instructor : this.options.instructor,
            course : this.options.course,
            edition : this.options.edition
          })); 
      },

      save: function(e) {
        var self = this;
        this.model.urlRoot = /(.*\/certificates)\/.*/.exec(window.location.href)[1];

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
    })

});