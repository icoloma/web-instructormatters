define([ 'core', 'hbs!./editview', 'hbs!../template/message' ], 
  function(K, template, messageTmpl) {
  
    return B.View.extend({

      events: {
        'click #delete' : 'delete',
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      render: function() {
        var edition = this.model.edition;
        this.$el.html(template(this.model.toJSON()));
      },

      save: function(e) {
        var self = this;
        this.model.save({}, {
         
          success: function() {
            var msg = messageTmpl({
              type: 'success',
              message: 'Save OK'
            })
            self.$el.prepend(msg);
          },

          error: function(resp, status, xhr){
            if (status.status === 201){   // Http status Ok, Created
              var location = status.getResponseHeader("location");
              window.location=location;              
            } else {
              var error = messageTmpl({
                type: 'error',
                message: 'Error while saving'
              })
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
            window.location=self.model.urlRoot;
          },
          error: function(){
            var error = messageTmpl({
              type: 'error',
              message: 'Error while deleting'
            })
            self.$el.prepend(error);
          }
        });
        e.preventDefault();
      }

    })

});