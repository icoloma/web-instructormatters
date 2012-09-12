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
        this.$el.html(template( this.model.toJSON())); 
        this.$('select').val(this.model.get('locale'));
        return this;
      },

      enableAddBtn: function() {

        $('.add').prop('disabled', $(this.el).find('tr').length >= MAX_ROWS);
      }

    })

});