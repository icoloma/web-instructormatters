define(
[ 'core' ],
function(K, template) {
  
  return B.Model.extend({

    defaults: {
      title: '',
      duration: 0,
      url: '',
      thumbnail: '',
      duration : 0   // seg
    }

  });

});