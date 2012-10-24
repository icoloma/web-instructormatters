/*
  Extrae el id del vídeo de una url
*/
exports.getIdYoutube = function (url){
   return /.+youtube.+watch\?v=([^&]+)/.exec(url)[1];
}


/*
  Obtener información de youtube del video
*/
exports.getData = function(url){

  var idYoutube = this.getIdYoutube(url);
  
  async.parallel([
    function(callback){
      jquery.ajax({
        url: 'http://gdata.youtube.com/feeds/api/videos/' + idYoutube + '?v=2&alt=json',
        success: callback, 
        context: context
      });
    }
    ],function(err,results,foo,bar){
      console.log(results);

  });
/*
  JSONP
  http://gdata.youtube.com/feeds/api/videos/vqDbMEdLiCs?v=2&alt=json-in-script&format=5&callback=showMyVideos
*/
}




