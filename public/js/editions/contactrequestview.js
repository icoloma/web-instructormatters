define(['core', 'editions/contactrequestmodel', 'hbs!./contactrequestview'], 
  function(Core, ContactRequestModel, template) {

    return B.View.extend({

      events : {
        'submit form' : 'send',
        'change input, textarea' : 'onChange',
        'click .btn.contact' : 'render'
      },

      render: function() {
        //this.model.attributes.to = this.options.adressee.email;
        this.hiddenContent = this.$el.html();
        this.$el.html(template({
            editionDate: this.options.editionDate,
            editionVenue: this.options.editionVenue,
            courseName : this.options.courseName
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
        if (this.hiddenContent != "") {
          this.$el.html(this.hiddenContent);
        } 
        Core.renderMessage({level: 'info', message: 'Mail Sent'});
      }

    });
  });