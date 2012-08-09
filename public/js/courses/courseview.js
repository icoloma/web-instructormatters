define([ 'core', 'hbs!./courseview', 'messages' ], 
  function(Core, template, messageTmpl) {
  
    return B.View.extend({

      events: {
        'click #delete' : 'delete',
        'click #back' : 'showCourses',
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      showCourses : function() {
        window.location = this.model.urlRoot ;
      },

      render: function() {
        var edition = this.model.edition;
        this.$el.html( template( {
            course: this.model.toJSON(),
            message: messageTmpl.getMessage('Course'),
          })); 
      },

      
      save: function(e) {
        var self = this;
        this.model.save({}, {
         
          success: function() {
            window.location = self.model.url()  + "?code=u";
          },

          error: function(resp, status, xhr){
            if (status.status === 201){   
              // Http status Ok, Created
              var location = status.getResponseHeader("location") + "?code=s";
              window.location=location;              
            } else {
              // error
              var error = messageTmpl.getMessage('Course','e');
              self.$el.prepend(error);
            }
          }
        });
        e.preventDefault();
      },

     
      delete: function(e){
        var self=this;
        this.model.destroy({
          success: function(resp, status, xhr) {
            window.location=self.model.urlRoot+ "?code=d";;
          },
          error: function(){
            var error = messageTmpl.getMessage('Course','e');
            self.$el.prepend(error);
          }
        });
        e.preventDefault();
      }

    })

});