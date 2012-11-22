
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
        'change input.certificates' : function(e){
          if (e.currentTarget.checked){
            this.model.attributes.certificates.push(e.currentTarget.value);
          } else  {
            this.model.attributes.certificates = _.without(this.model.attributes.certificates, e.currentTarget.value);
          }

        },
        'change input.email,select,input.address': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
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
          $.map(this.model.attributes.certificates, function(item){ 
            var query = 'input[name=certificates_' + item + ']';
            $(this.$(query)[0]).attr('checked', true);
          });

        }

      },

      
      save: function(e) {
        var self = this;
        this.model.save({}, {
         
          success: function(resp, status, xhr) {
            window.location.href = self.model.url()  + "/#updated";
          },

          on201: function( xhr) {
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "/#saved";
            window.location.href =location;              
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