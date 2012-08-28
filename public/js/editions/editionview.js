define([ 'core', 'certificates/certificatecollectionview', 'certificates/certificatemodel', 'hbs!./editionview' ], 
  function(Core, CertificateCollectionView,CertificateModel, template) {

    return B.View.extend({

      events: {
        'click .delete'         : 'delete',
        'submit form'           : 'save',
        'change input, select'  : 'onChange'
      },

      render: function() {
        this.$el.html( template( {
          edition: this.model.toJSON(),
          instructors : this.options.instructors,
          course : this.options.course,
          certificates : this.options.certificates
        })); 
        this.$("select[name=instructor]").val(this.model.attributes.instructor);
        this.$("select[name=state]").val(this.model.attributes.status);

        // certificates
        /*
        var certificatesView = new CertificateCollectionView({
          collection: this.model.certificates,
          el: this.$('.certificates')
        }).render();*/
      },

      onChange : function(e) {
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
      },

      save: function(e) {


        this.model.save({}, {
         
          success: function(resp, status, xhr) {
            location.href = resp.url() + "?code=updated";
          },

          on201: function(xhr){
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "?code=saved";
            window.location=location;              
          }
        });
        e.preventDefault();
      },

      delete: function(){ 

        var self = this;

        this.model.urlRoot = '/admin/courses/' + this.model.get('course') + '/editions'
        this.model.destroy({
          success: function() {
            location.href = '/courses/'+ self.options.course.uuid + '?code=deleted';
          },
          error: function(resp, status, xhr){
            Core.renderMessage({ level:'error', message:status.statusText});
          }
        });
      }

    })

});