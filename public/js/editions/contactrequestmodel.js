define(['core'], 
  function(Core) {
    return B.Model.extend({
      
      url: function() {
        console.log(JSON.stringify(this));
        console.log('courses/' + this.get('courseUUID') + '/editions/' + this.id + '/contact');
        return 'courses/' + this.get('courseUUID') + '/editions/' + this.id + '/contact';
      }

    });
  }
);