
define([ 'core', 'backbone', 'hbs!./userview' ], 
  function(Core, B, template) {

    return Backbone.View.extend({

      events: {
        'click #delete' : 'delete',
        'click #list' : 'list',
        'submit form': 'save',
        'change input.courses' : function(e){
          if (e.currentTarget.checked){
            this.model.attributes.courses.push(e.currentTarget.value);
          } else  {
            this.model.attributes.courses = _.without(this.model.attributes.courses, e.currentTarget.value);
          }

        },
       
        'change input.email,select,input.address': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },

        'change input.expires': function(e){
          this.model.attributes.certificates = [];
          var self = this;
          $('.expires').each(function(idx, date){
            if (date.value.length > 0 )
              self.model.attributes.certificates.push( {uuid: $(date).data('uuid'),expires:date.value});
          });
        }
      },

      list : function() {
        window.location.href = this.model.urlRoot ;
      },

      render: function() {
        var edition = this.model.edition;
        this.$el.html( template( {
            user: this.model.toJSON(),
            courses: this.options.courses
          })); 

        $(this.$("select[name=admin]")[0]).val(JSON.stringify(this.model.attributes.admin));
       
        if (this.model.attributes.id) {
          $.map(this.model.attributes.courses, function(item){ 
            var query = 'input[name=courses_' + item + ']';
            $(this.$(query)[0]).attr('checked', true);
          });
          $.map(this.model.attributes.certificates, function(certificate){ 
            $(this.$( 'input[name=certificates_' + certificate.uuid + ']')[0]).attr('checked', true);
            var expiresField =   $(this.$( 'input[name=expires_' + certificate.uuid + ']')[0]);
            expiresField.val(certificate.expires);
          });

        }
       
        googleId = this.model.get('googleId');
        // load instructor profile image 
        setTimeout(function(){
          $('<img class="profile-img" src="https://profiles.google.com/s2/photos/profile/' + googleId + '">').on('load', function() {$('#avatar').replaceWith(this);});
        }, 300);

      },

      
      save: function(e) {
        Core.loadingButton($('#send'), true);
        var self = this;
        this.model.save({}, {
         
          success: function(resp, status, xhr) {
            Core.renderMessage({ level :'info',  message :'User saved' });
            Core.loadingButton($('#send'), false);
          },

          on201: function( xhr) {
            Core.renderMessage({ level :'info',  message :'User saved' });
            Core.loadingButton($('#send'), false);
          }
        });
        e.preventDefault();
      },

     
      delete: function(e){
        var self=this;
        this.model.destroy({
          success: function(resp, status, xhr) {
            window.location.href =self.model.urlRoot+ "/#deleted";;
          }
        });
        e.preventDefault();
      }

    })

});