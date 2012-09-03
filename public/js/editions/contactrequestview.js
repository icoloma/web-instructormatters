define(['core', 'editions/contactrequestmodel', 'hbs!./contactrequestview'], 
  function(Core, ContactRequestModel, template) {

    return B.View.extend({

      events : {
        'submit form' : 'send',
        'change input, textarea' : 'onChange',
        'click .btn.contact' : 'render'
      },

      render: function() {
        this.model.attributes.to = this.options.instructor.email;
        this.hiddenContent = this.$el.html();
        this.$el.html(template({
            instructor : this.options.instructor,
            course : this.options.course
          })
        );
      },

      onChange : function(e) {
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
      },

      send: function(e) {
        e.preventDefault();
        var self = this;
        try {
          this.model.save({}, {
            success:  function(resp, status, xhr) {
              this.view.remove()
            },
            on201: function(xhr) {
              //after a sucessful mail delivery, we remove the view.
              self.restore();
            }
          });
        } catch (err) {
          console.log(err);
        }
      },

      restore: function(e) {
        console.log("removing view");
        this.$el.html(this.hiddenContent);
      }

    });
  });