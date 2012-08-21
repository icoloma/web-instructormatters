define([ 'core', 'backbone', 'hbs!./editionview' ], 
  function(Core, B, template) {

    return Backbone.View.extend({

      events: {
        'click .delete' : 'delete',
        'click #list' : 'list',
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },
        'change select': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      list : function() {
        window.location = this.model.urlRoot ;
      },

      render: function() {
        var json = this.model.toJSON();
        this.$el.html( template( {
          edition: this.model.toJSON(),
          instructors : this.options.instructors,
          courses : this.options.courses,
          certificates : this.options.certificates
        })); 
        this.$("select[name=course]").val(json.course);
        this.$("select[name=instructor]").val(json.instructor);
      },

      save: function() {
        this.model.save({}, {

          context: this,
         
          success: function(resp, status, xhr) {
            window.location = this.model.url()  + "?code=updated";
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
      },

      delete: function(){
        this.model.destroy({
          context: this,
          success: function() {
            location.href = this.model.urlRoot+ "?code=deleted";;
          }/*,
          error: function(resp, status, xhr){
            Core.renderMessage({ level:'error', message:status.statusText});
          }*/
        });
      }

    })

});