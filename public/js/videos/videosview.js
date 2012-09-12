define([ 'core', 'hbs!videos/videosview' ,'videos/videotrview' ], 
  function(Core,template, VideoTrView ) {

    var MAX_ROWS = 3;

    return B.View.extend({

      events: {
        'click .add' : 'addVideo',
      },

      render: function() {
        this.$el.html(template());
        this.$tbody = this.$('tbody');
        this.collection.forEach(this.addRow, this.model);
        return this;
      },

      addVideo : function(){
        this.collection.push( new Backbone.Model({ url:'', locale:'en'}));
        this.render();
      },


      addRow: function(model) {
        var trView = new VideoTrView({ 
          model : model
        });
        this.$tbody = this.$('tbody');
        this.$tbody.append(trView.render().$el);

      },

      enableAddBtn: function() {
        this.$('.add').prop('disabled', this.$tbody.find('tr').length >= MAX_ROWS);
      }

    });

})