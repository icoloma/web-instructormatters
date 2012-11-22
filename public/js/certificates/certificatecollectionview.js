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

      save: _.throttle(function(e) {
        
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
            window.location.href = '/courses/' + self.options.course.uuid + '/editions/' + self.model.id  + "/#updated";
          },

          on201: function(xhr){
              // Http status Ok, Created
              var location = xhr.getResponseHeader("location") + "/#saved";
              window.location.href=location;              
          }

        });


      }, 1000),

    });

})