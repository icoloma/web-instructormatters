define([ 'core', 'hbs!./videoview' ], 
  function(Core, template) {
    var MAX_ROWS = 3;
  
    return Backbone.View.extend({

      tagName: 'tr',

      events: {

       'click .delete' : function(){
          this.remove();
          this.model.collection.remove(this.model);
          this.enableAddBtn();
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
            id: '',
            title: '',
            thumbnail: ''
          });
        },
      },

      render: function() {
        var coursesWithNames = [];
        this.options.courses.forEach( function(course){
          coursesWithNames.push( {
            uuid : course.uuid,
            name : course.name
          });
        });
        this.$el.html(template( _.extend( this.model.toJSON(), {courses: coursesWithNames}))); 
        this.$('select.locale').val(this.model.get('locale'));
        this.$('select.courseUUID').val(this.model.get('courseUUID'));
        return this;
      },

      enableAddBtn: function() {

        $('.add').prop('disabled', $(this.el).find('tr').length >= MAX_ROWS);
      }

    })

});