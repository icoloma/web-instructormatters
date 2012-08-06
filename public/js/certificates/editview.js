define([ 'core' ], function() {
  
  window.EditView = B.View.extend({

    initialize: function() {
      this.template = _.template(
        '<form>' +
          '<label>' +
            '<input name="userName" type="text">' +
          '</label>' +
        '</form>'
      );
    },

    render: function() {
      this.$el.html(this.template());
      this.$el.find('[name=userName]').val(this.model.get('userName'));
    }

  })

});