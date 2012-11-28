define([ 'core', 'hbs!./videoview' ], 
  function(Core, template) {
    var MAX_ROWS = 3;
  
    return Backbone.View.extend({

      tagName: 'tr',

      events: {

       'click .delete' : function(e){
          if ( this.model.collection.length -1 >= MAX_ROWS ){
            $('.addVideo').hide();
          } else {
            $('.addVideo').show();
          }

          this.model.destroy({
            success: function(model, response){
              Core.renderMessage({ level :'info',  message :'The video was deleted'}, $('.videos-messages-container'));
            },
            error: function(model, error){
              Core.renderMessage({ level :'error',  message :'Error removing video'}, $('.videos-messages-container'));
            }
          }

            );
          this.remove();
        },
        
        'change select': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },


        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
          this.updateVideoInfo();
        },
      },

      render: function() {
        this.$el.html(template( _.extend( this.model.toJSON(), {courses: this.options.coursesWithNames}))); 
        this.$('select.locale').val(this.model.get('locale'));
        this.$('select.courseUUID').val(this.model.get('courseUUID'));
        return this;
      },

      updateVideoInfo: function (){
        // reset de los campos que pediremos a Youtube
        this.model.set({
          youtubeId: '',
          title: '',
          thumbnail: '',
          ranking : {}
        });

        this.render();

        var match = /.+youtube.+watch\?v=([^&]+)/.exec(this.model.get('url'));
        if (!match){
          // Delegamos en la validación de HTML5
          return;
        }
        /* La llamada ajax JSONP a Youtube puede dar un 400 que no se puede capturar a traves del error: */
        setTimeout( _.bind(function() {
          if (!this.model.get('youtubeId'))
            Core.renderMessage({ level :'danger',  message :'error retrieving video info'}, this.$('.video-messages-container'));
        }, this), 2000);

        var youtubeId =  match[1];
        $.ajax({
          url: 'http://gdata.youtube.com/feeds/api/videos/' + youtubeId + '?v=2&alt=json-in-script&format=5', 
          dataType: 'jsonp',
          context: this,

          success: function(data) {
           
            var numLikes = 0;
            var numDislikes = 0;
            if ( data.entry.yt$rating ){
              numLikes = data.entry.yt$rating.numLikes;
              numDislikes = data.entry.yt$rating.numDislikes;
            }
            var rankingValue = numLikes - numDislikes;
            this.model.set({ 
              youtubeId: youtubeId,
              title: data.entry.title.$t,
              thumbnail: data.entry.media$group.media$thumbnail[1].url,
              duration: data.entry.media$group.yt$duration.seconds,
              ranking : {
                numLikes : numLikes,
                numDislikes: numDislikes,
                value: rankingValue
              }
            });
            this.render();
            if (this.model.get('duration') > 180 ) {
              Core.renderMessage({ level :'danger',  message :'The video is over 3 min.'}, this.$('.video-messages-container'));
            }
          }
        });
        
      }


    })

});