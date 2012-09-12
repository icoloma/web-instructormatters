
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
          collection: this.model.videos,
          el: $('.videos')
        }).render();
        return this;
      },


      save: function(e) {
        e.preventDefault();

        if (this.model.videos.length == 0){
          this.doSave();
          return;
        }

        // Obtenemos información de cada video:
        this.model.videos.forEach( function( videoModel ){
            var id =  /.+youtube.+watch\?v=([^&]+)/.exec(videoModel.get('url'))[1];
            $.ajax({
              url: 'http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json-in-script&format=5', 
              dataType: 'jsonp',
              context: this,
              success: function(data) {
                videoModel.set({ 
                  id: id,
                  title: data.entry.title.$t,
                  thumbnail: data.entry.media$group.media$thumbnail[1].url,
                  duration: data.entry.media$group.yt$duration.seconds
                });
                this.model.videos.all(function(v) { return v.get('title') }) && this.doSave();
              } 
            });
          }, this);
      },

      doSave: function() {
        var self = this;
        this.model.save({ }, {
         
          success: function(resp, status, xhr) {
            window.location = self.model.url()  + "?code=updated";
          },

          on201: function( xhr) {
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "?code=saved";
            window.location=location;              
          }
        });
      }

    })

});