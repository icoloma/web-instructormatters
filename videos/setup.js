exports.getURLVideoEmbedded = function(url) {
   var idYoutube = /.+watch\?v=([^&]+)/.exec(url)[1];
   return 'https://www.youtube.com/embed/' + idYoutube + '?rel=0';
};  




