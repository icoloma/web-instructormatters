define(['core', 'editions/contactrequestmodel', 'hbs!./contactrequestview'], 
  function(Core, ContactRequestModel, template) {

    return B.View.extend({

      events : {
        'submit form' : 'send'
      },

      render: function() {
        console.log('Rendering view');
        this.$el.html(template({
            instructor : this.options.instructor,
            course : this.options.course
          })
        );
      },

      send: function(e) {
        e.preventDefault();
        try {

          this.model.save({}, {
            success:  function(resp, status, xhr) {
              console.log('sucess');
            }
          });
        } catch (err) {
          console.log(err);
        }
      }

    });
  });