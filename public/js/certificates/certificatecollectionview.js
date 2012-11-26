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

        Core.loadingButton($('#send'), true);

        e.preventDefault();

        var data = JSON.stringify(this.collection.toJSON());
        var courseUUID = this.options.courseUUID;
        var edition = this.options.edition;

        var urlEdition = '/courses/' + courseUUID + '/editions/' + edition;

        this.collection.url = urlEdition + '/certificates';;

        B.sync( "create", this.collection, {
          on201: function( xhr) {
            Core.renderMessage({ level :'info',  message :'Certificates saved' });
            Core.loadingButton($('#send'), false);
          }
        });
      }

    });
})