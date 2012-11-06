define(
[ 'core', 'hbs!instructors/instructorcollectionview', 'lib/gmaps' ], 
function(K, template, Gmaps) {

  var countryNames = {
    'undefined': 'Great kingdom of undefined',
    'ES': 'Spain',
    'UK': 'United Kingdom',
    'US': 'United States'
  }

  return B.View.extend({

    events: {
      'change select[name="country"]': 'onSelectCountry',
      'hover .instructor': 'onClickInstructor',
      'click #certifiedButton': 'hideNonCertifiedInstructors',
      'click #allButton': 'showNonCertifiedInstructors' 
    },

    initialize: function() {
      this.geo = { latitude: 40.416698, longitude: -3.700333 };

      // if there is HTML5 geolocation, override default location
      navigator.geolocation && navigator.geolocation.getCurrentPosition(_.bind(function(data) {
        this.geo = data.coords
      }, this));
    },

    render: function() {
      Gmaps.loadMapsAPI(this.doRender, this);
      this.renderCountryPicker();
    },

    renderCountryPicker: function() {
      // sorted list of unique country names
      var countries = _.chain(this.options.instructors)
        .map(function(instructor) {
          return instructor.country || 'undefined';
        })
        .uniq()
        .sort()
        .value();

      // concatenate <option> tags
      var optionTmpl = _.template('<option value="{{value}}">{{-label}}</option>');
      var $options = 
        optionTmpl({ value: '', label: 'Pick your country'}) +
        optionTmpl({ value: '', label: 'All'}) +
        _.map(countries, function(country) {
          return optionTmpl({ 
            value: country, 
            label: countryNames[country] || country
          });
        }).join('');

      // create select and disable first option ("select your country")
      $('.country-picker')
        .html('<select name="country">' + $options + '</select>')
        .find('option:first-child')
        .attr('disabled', '');
    },

    onSelectCountry: function(e) {
      var country = $(e.currentTarget).val()
      , selectedInstructors = _.filter(this.options.instructors, function(instructor) {
        var value =  country === ''? true :
          instructor.country == country || country == 'undefined' && !instructor.country
        this.$('[data-id=' + instructor.id + ']').toggle('hidden', !value);
        return value;
      });
      this.addInstructorsToMap(selectedInstructors);
    },

    // invoked by Google maps when the library has been loaded
    doRender: function() {
      this.map = new google.maps.Map(this.$('.map')[0], {
        zoom: 5,
        center: new google.maps.LatLng(this.geo.latitude, this.geo.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.addInstructorsToMap(this.options.instructors);
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

    hideNonCertifiedInstructors: function(e){
      $('#allButton').show();
      $('#certifiedButton').hide();
      $('.certified-false').hide();
      
      $('.certified-false').each( function(idx,elem) {
        var elem = $(elem);
        elem.hide();
        var id = elem.data('id');
        var m = window.view.markers[id];
        m.marker.setMap(null);
      });
      
    },

    showNonCertifiedInstructors: function(e){
      $('#allButton').hide();
      $('#certifiedButton').show();
      $('.certified-false').each( function(idx,elem) {
        var elem = $(elem);
        elem.show();
        var id = elem.data('id');
        var m = window.view.markers[id];
        m.marker.setMap(window.view.map);
      });
    }

  })

});
    
