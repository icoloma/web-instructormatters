define([ 'core', 'backbone', 'hbs!./courseview' ], 
  function(Core, B, template) {

    return Backbone.View.extend({

      events: {
        'click #delete' : 'delete',
        'submit form': 'save',
        'click .cancel' :  function(e) { location.href = this.model.url() },
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      render: function() {
        var edition = this.model.edition;
        this.$el.html( template( {
            course: this.model.toJSON()
          })); 
      },

      
      save: function(e) {
      
        this.model.save({}, {

          success: function(resp, status, xhr) {
            window.location.href =  resp.url() + "/#updated";
          },


          on201: function(xhr){
              // Http status Ok, Created
              var location = xhr.getResponseHeader("location") + "/#saved";
              window.location.href=location;              

          }


        });

        e.preventDefault();
      },

     
      delete: function(e){
        var self=this;
        this.model.destroy({
          success: function(resp, status, xhr) {
            window.location.href= "/courses/#deleted";;
          }
        });
        e.preventDefault();
      }

    })

});