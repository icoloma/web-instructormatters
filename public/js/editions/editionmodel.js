define([ 'core' ], function() {

  return Backbone.Model.extend({

    urlRoot : '/editions',
    

    /**
      @param options.user {UserModel}
      @param options.course {CourseModel}
    */
    initialize: function(options) {
      this.user = options.user;
      this.course = options.course;
    }
  });

});