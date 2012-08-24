define([ 'core' ], 
  function(Core) {

    return B.View.extend({

      render: function() {
        this.$el.html('<ul></ul>');
        this.$ul = this.$('ul');
        this.collection.each(this.addLI, this);
      },

      addLI : function(item, foo, bar, foobar){
          this.$ul.append('<li><a href="/certificates/' + item.get('uuid') + '">' + item.get('name')  + ' - ' +  item.get('email')+ '</a></li>');
          
      }


    });

})