define([ 'core', 'certificates/certificatetrview', 'certificates/certificatemodel', 'hbs!certificates/certificatecollectionview' ], 
  function(Core, CertificateTrView, CertificateModel, template) {

    return B.View.extend({

      events: {
        'click .addCertificate' : 'addCertificate',
        'submit form'           : 'save',
      },

      render: function() {
        this.$el.html(template());
        this.$tbody = this.$('tbody');
        this.collection.each(this.addTrView, this);
      },


      addCertificate : function(){
        this.collection.push( new CertificateModel({}));
        this.render();
      },

      addTrView: function(model) {
        var trView = new CertificateTrView({ 
          model : model
        });
        this.$tbody.append(trView.render().$el);
      },

      save: function(e) {
        
        e.preventDefault();

        var data = JSON.stringify(this.collection.toJSON());
        var courseUUID = this.options.courseUUID;
        var edition = this.options.edition;
        var url = '/courses/' + courseUUID + "/editions/" + edition + "/certificates";
        var self = this;

        $.ajax({
          type: 'POST',
          url: url,
          data: data,
          dataType: 'json',
          contentType: 'application/json',
          success: function(data, textStatus, jqXHR) {
            window.location = '/courses/' + self.options.course.uuid + '/editions/' + self.model.id  + "?code=updated";
          },

          on201: function(xhr){
              // Http status Ok, Created
              var location = xhr.getResponseHeader("location") + "?code=saved";
              window.location=location;              
          }

        });


       
        /*
        var self = this;
        var editionUrl = this.$('.cancel')[0].href;

        this.collection.urlRoot = '/admin/courses/' + this.model.get('course') + '/editions';
        this.model.save({}, {

          success: function(resp, status, xhr) {
            window.location = '/courses/' + self.options.course.uuid + '/editions/' + self.model.id  + "?code=updated";
          },

          
        });
        e.preventDefault();
        */
      }

    });

})