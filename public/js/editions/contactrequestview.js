define(['core', 'editions/contactrequestmodel', 'hbs!./contactrequestview'], 
  function(Core, ContactRequestModel, template) {
   
    var recaptcha_public_key = '6Ld6XNkSAAAAAFWO8kLJP_tyktr_SB3c9zqD7fn_';

    return B.View.extend({

      events : {
        'click  #send' : 'send',
        'change input, textarea' : 'onChange',
        'click .btn.contact' : 'render'
      },

      render: function() {
        //this.model.attributes.to = this.options.adressee.email;
        this.hiddenContent = this.$el.html();
        this.$el.html(template({
            editionDate: this.options.editionDate,
            editionVenue: this.options.editionVenue,
            courseName : this.options.courseName,
            message : this.options.message
          })
        );
        Recaptcha.create( recaptcha_public_key, 'recaptcha',
            {
              theme: "white",
              callback: Recaptcha.focus_response_field
            }
          );


      },

      onChange : function(e) {
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
      },

      send: function(e) {
        $('button.#send').button('loading');
        e.preventDefault();
        var self = this;
        try {
          this.model.set('recaptcha_challenge_field', $('#recaptcha_challenge_field').val());
          this.model.set('recaptcha_response_field',$('#recaptcha_response_field').val());
          this.model.save({}, {
            success:  function(resp, status, xhr) {
              this.view.remove();
              $('#send').button('reset');
            },
            on201: function(xhr) {
              $('#send').button('reset');
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