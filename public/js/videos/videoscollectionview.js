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

    });
})