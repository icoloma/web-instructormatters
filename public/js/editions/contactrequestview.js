define(['core', 'editions/contactrequestmodel', 'hbs!./contactrequestview'], 
  function(Core, ContactRequestModel, template) {

    return B.View.extend({

      events : {
        'submit form' : 'send',
        'change input, textarea' : 'onChange'
      },

      render: function() {
        this.model.attributes.to = this.options.instructor.email;
        this.$el.html(template({
            instructor : this.options.instructor,
            course : this.options.course
          })
        );
        this.$("[name=toAddress]").val(this.options.instructor.email);
      },

      onChange : function(e) {
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
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