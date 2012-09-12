define(
[ 'core' ], 
function(K) {

  var isGoogleMapsLoaded = function() {
    return window.google && google.maps && google.maps.Map;
  }

  return {

    isGoogleMapsLoaded: isGoogleMapsLoaded,

    /**
      @param callback {Function} el callback a invocar cuando el Google Maps API ha sido cargado
      @param context {Object} el valor de this cuando se invoque al callback
    */
    loadMapsAPI: function(callback, context) {
      var f = function () {
        callback.call(context);
      }
      if (isGoogleMapsLoaded()) {
        f();
        id && delete window[id];
      } else {
        var id = _.uniqueId('__cb');
        window[id] = f;
        $.ajax({
          url: 'https://maps.googleapis.com/maps/api/js',
          dataType: 'script',
          data: {
            libraries: 'places',
            sensor: 'true',
            callback: id
          }
        });
      }
    },
    /*
      @param place PlaceGeomnetry the details of a location as returned by Google Maps
      @param geo '{lat:X,lng:Y}' the location as included in Venue.Model.geo
      @param defaultLocationCallback a method to invoke if/when the user allows us to automatically locate it
    */
    getLocation: function(place, geo, defaultLocationCallback) {
      if (place) { // return the location provided by Google
        return place.geometry? place.geometry.location : place.location;
      } 
      if (geo) { // the venue provides a location
        return new google.maps.LatLng(geo.lat, geo.lng);
      }
      if (navigator.geolocation) {  // try to use the browser geoposition
        navigator.geolocation.getCurrentPosition(function(position) {
          var geo = position.coords;
          defaultLocationCallback(new google.maps.LatLng(geo.latitude, geo.longitude));
        }); 
      }
      // use a default location
      return new google.maps.LatLng(40.416698, -3.700333);
    },

    /**
    Crea un enlace a Google Maps. Esta función está basada en GoogleMapsUrlFactory.java
      data.geo {Object(lat, lng)} el geo a buscar
      data.address: la dirección a buscar
      data.title: el título a mostrar
    */
    createLink: function(data) {
      if (!data.address && !data.geo)
        return '';
      return ' <a target="_blank" href="https://maps.google.com/maps?oe=UTF8&z=13' +
        (data.geo? '' : '&ll=' + data.geo.lat + ',' + data.geo.lng) +
        (data.address? '' : '&q=' + data.address + ' (' + data.title + ')') +
        '">' + res.showInMap + '</a>'
    }

  }
  
})
