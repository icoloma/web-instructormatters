
define([ 'core', 'videos/videosview', 'hbs!./instructorview' ], 
  function(Core, VideosView, template) {

    return Backbone.View.extend({

      events: {
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      render: function() {
        this.$el.html( template( { instructor: this.model.toJSON() }));

        this.videosView = new VideosView({
          collection: new B.Collection(this.model.get('videos')),
          el: $('.videos')
        }).render();
        return this;
      },


      save: function(e) {
        e.preventDefault();
        var self = this;
        this.model.save({
          videos: this.videosView.collection.toJSON()
        }, {
         
          success: function(resp, status, xhr) {
            window.location = self.model.url()  + "?code=updated";
          },

          on201: function( xhr) {
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "?code=saved";
            window.location=location;              
          }
        });
      },

    })

});