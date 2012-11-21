define([ 'core', 'videos/videotrview', 'videos/videomodel', 'hbs!videos/videoscollectionview', 'lib/messages' ], 
  function(Core, VideoTrView, VideoModel, template, Messages) {

    
    var MAX_ROWS = 3;
    var numVideosProcessed = 0;

    return B.View.extend({

      events: {
        'click .addVideo'       : 'addVideo',
      },

      render: function() {
        var coursesWithNames = [];
        this.options.coursesWithNames = coursesWithNames;
        this.options.courses.forEach( function(course){
          coursesWithNames.push( {
            uuid : course.uuid,
            name : course.name
          });
        });

        this.$el.html(template());
        this.$tbody = this.$('tbody');
        this.collection.each(this.addTrView, this);
        if ( this.collection.length >= MAX_ROWS){
          $('.addVideo').hide();
        } else {
          $('.addVideo').show();
        }
      },


      addVideo : function(){
        this.collection.push( new VideoModel({
          instructorName: this.options.instructorName
        }));
        this.render();
      },

      addTrView: function(model) {
        var trView = new VideoTrView({ 
          model : model,
          coursesWithNames: this.options.coursesWithNames
        });
        this.$tbody.append(trView.render().$el);
      },

      saveVideos: function() {
        
        var data = JSON.stringify(this.collection.toJSON());
        var instructorId = this.options.instructorId;
        
        var url = '/instructors/' + instructorId + "/videos/";
        var self = this;

        $.ajax({
          type: 'POST',
          url: url,
          data:  data,
          dataType: 'json',
          contentType: 'application/json',
          on201: function(xhr){
            Core.renderMessage( { level:"success", message:'Instructor data and Videos saved'});
            Core.loadingButton($('#send'), false);
          },
        });
      },

      save: function(e){
        numVideosProcessed = 0;

        /* La llamada ajax JSONP a Youtube puede dar un 400 que no se puede capturar a traves del error: */
        setTimeout( _.bind(function() {
          if (numVideosProcessed < this.collection.length)
             Core.renderMessage({ level :'danger',  message :'Videos couldn\'t be saved'});
            Core.loadingButton($('#send'), false);
        }, this), 10000);


        // Obtenemos información de cada video:
        this.collection.forEach( function( videoModel ){
        var youtubeId =  /.+youtube.+watch\?v=([^&]+)/.exec(videoModel.get('url'))[1];
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
            videoModel.set({ 
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
            if (videoModel.get('duration') <= 180 ) {
              numVideosProcessed += 1;
              numVideosProcessed == this.collection.length && this.saveVideos();
            } else {
              Core.renderMessage({ level :'danger',  message :'The video "' + videoModel.get('title') +  '" is over 3 min.'});
              Core.loadingButton($('#send'), false);
            }
          }
       

        });
      }, this);

      }

    });



})