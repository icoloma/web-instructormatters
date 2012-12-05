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
        this.collection.url = '/courses/' + this.options.courseUUID + '/editions/' + this.options.edition + '/certificates'; 
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

        Core.loadingButton($('#send'), true);

        e.preventDefault();
        window.thisView = this;

        var data = JSON.stringify(this.collection.toJSON());
        B.sync( "create", this.collection, {
          on201: function( xhr) {

            // actualiza los certificados para recuperar los id's
            window.thisView.collection.fetch({
              success: function(resp, status, xhr) {
                window.thisView.render();
                Core.renderMessage({ level :'info',  message :'Certificates saved' });
               }
            });  
          }
        });
      }

    });
})