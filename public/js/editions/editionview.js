define([ 'core', 'certificates/certificatecollectionview', 'certificates/certificatemodel', 'hbs!./editionview' ], 
  function(Core, CertificateCollectionView,CertificateModel, template) {

    return B.View.extend({

      events: {
        'click .delete'         : 'delete',
        'submit form'           : 'save',
        'click .cancel'         : 'cancel',
        'click .addCertificate' : 'addCertificate',
        'change input, select'  : 'onChange'
      },

      onChange : function(e) {
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
      },

      cancel : function(e) { 
        window.location = '/courses/' + this.options.course.uuid + '/editions/' + this.model.id;  
      },

      render: function() {
        var json = this.model.toJSON();
        this.$el.html( template( {
          edition: this.model.toJSON(),
          instructors : this.options.instructors,
          course : this.options.course,
          certificates : this.options.certificates
        })); 
        this.$("select[name=instructor]").val(json.instructor);

        // certificates
        var certificatesView = new CertificateCollectionView({
          collection: this.model.certificates,
          el: this.$('.certificates')
        }).render();
      },

    
      addCertificate : function(){
        this.model.certificates.push( new CertificateModel({}));
        this.render();
      },

      save: function(e) {
        var self = this;
        var editionUrl = this.$('.cancel')[0].href;

        this.model.urlRoot = '/admin/courses/' + this.model.get('course') + '/editions';
        this.model.save({}, {

          success: function(resp, status, xhr) {
            window.location = '/courses/' + self.options.course.uuid + '/editions/' + self.model.id  + "?code=updated";
          },

          error: function(resp, status, xhr){
            if (status.status === 201){   
              // Http status Ok, Created
              var location = status.getResponseHeader("location") + "?code=saved";
              window.location=location;              
            } else {
              Core.renderMessage({ level:'error', message: status.statusText});             
            }
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