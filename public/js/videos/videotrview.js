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

          this.model.destroy();
          this.remove();
        },
        
        'change select': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },


        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());

          // reset de los campos que pediremos a Youtube
          this.model.set({
            youtubeId: '',
            title: '',
            thumbnail: '',
            ranking : {}
          });
        },
      },

      render: function() {
        this.$el.html(template( _.extend( this.model.toJSON(), {courses: this.options.coursesWithNames}))); 
        this.$('select.locale').val(this.model.get('locale'));
        this.$('select.courseUUID').val(this.model.get('courseUUID'));
        return this;
      },


    })

});