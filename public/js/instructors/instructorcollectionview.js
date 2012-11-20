define(
[ 'core', 'hbs!instructors/instructorcollectionview', 'lib/gmaps' ], 
function(K, template, Gmaps) {


  return B.View.extend({

    events: {
      'click .location': 'onClickInstructor',
      'click #certifiedButton': 'filterInstructors',
    },

    initialize: function() {
      this.geo = { latitude: 40.416698, longitude: -3.700333 };
      $(window).on('resize', this.resizeMap);
    },

    remove: function(){
      $(window).on('off', this.resizeMap);
    },

    render: function() {
      this.resizeMap();
      Gmaps.loadMapsAPI(this.doRender, this);
    },

    resizeMap: function(){
      var newSize = $(window).height() - 300;
      $('.map').height( newSize + 40);
      $('.instructor-list').height(newSize);
    },

   
    // invoked by Google maps when the library has been loaded
    doRender: function() {
      this.map = new google.maps.Map(this.$('.map')[0], {
        center: new google.maps.LatLng(this.geo.latitude, this.geo.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.addInstructorsToMap(this.options.instructors);
      google.maps.event.addListener(this.map, 'bounds_changed', _.bind(this.filterInstructors,this));
    },


    addInstructorsToMap: function(selectedInstructors) {
      this.markers && _.each(this.markers, function(marker) {
        marker.marker.setMap(null);
        marker.infoWindow.setMap(null);
      });

      this.markers = {};
      delete this.currentMarker;
      var bounds = new google.maps.LatLngBounds();
      _.forEach( selectedInstructors, function(instructor) {
        var pos = new google.maps.LatLng( instructor.geopoint.lat, instructor.geopoint.lng)
        , marker = new google.maps.Marker({
          position: pos,
          map: this.map,
          title: instructor.name
        })
        , infoWindow = new google.maps.InfoWindow({
          content: template(instructor)
        });
        bounds.extend(pos);
        this.markers[instructor.id] = { 
          marker: marker,
          infoWindow: infoWindow
        };

        google.maps.event.addListener(marker, 'click', _.bind(this.openInfoWindow, this, instructor.id));
      }, this);
      this.map.fitBounds(bounds); 
    },

    onClickInstructor: function(e) {
      var id = $(e.currentTarget).data('id')
      , m = this.markers[id];
      K.assert(m, 'Cannot find marker for ' + id);
      this.openInfoWindow(id);
    },

    openInfoWindow: function(id) {
      if (this.currentMarker != this.markers[id]) {
        this.currentMarker && this.currentMarker.infoWindow.close();
        this.currentMarker = this.markers[id];
        this.currentMarker.infoWindow.open(this.map, this.currentMarker.marker);
      }
    },

    filterInstructors: function(e){
      if ($('.map:visible').length ){
        var latLngBounds = this.map.getBounds();
        $('.instructor-item').each( function(idx,elem) {
          elem = $(elem);
          var lat =  elem.data('lat');
          var lng = elem.data('lng');
          var latLng = new google.maps.LatLng(lat,lng);
          var showOnlyCertified = $('#certifiedButton').hasClass('active');
          if (e) {
            // the 'active' class is added after
            showOnlyCertified = !showOnlyCertified ;
          }
          var mustHide = showOnlyCertified && ! elem.data('certified')
          if (!latLngBounds.contains(latLng) || mustHide){
            elem.hide();
            var id = elem.data('id');
            var m = window.view.markers[id];
            m.marker.setMap(null);
          } else {
            elem.show();
            var id = elem.data('id');
            var m = window.view.markers[id];
            m.marker.setMap(window.view.map);
          }
          
        });
        if (! $('.instructor-item:visible').length){
          $('#noInstructors').show();
        } else {
          $('#noInstructors').hide();
        }
      }
     
    },

    

  })

});
    

