
define([ 'core', 'videos/videosview', 'hbs!./instructorview', 'lib/gmaps' ], 
  function(Core, VideosView, template, GMaps) {

    return Backbone.View.extend({

      events: {
        'submit form': 'save',
        'change input': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        }
      },

      render: function() {
        this.$el.html( template( { instructor: this.model.toJSON() }));

        this.videosView = new VideosView({
          collection: this.model.videos,
          el: $('.videos')
        }).render();

        // Carga la librería GoogleMaps
        GMaps.loadMapsAPI(this.addGMapAutocompleter, this);

        return this;
      },


      save: function(e) {
        e.preventDefault();

        if (this.model.videos.length == 0){
          this.doSave();
          return;
        }

        // Obtenemos información de cada video:
        this.model.videos.forEach( function( videoModel ){
            var id =  /.+youtube.+watch\?v=([^&]+)/.exec(videoModel.get('url'))[1];
            $.ajax({
              url: 'http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json-in-script&format=5', 
              dataType: 'jsonp',
              context: this,
              success: function(data) {
                videoModel.set({ 
                  id: id,
                  title: data.entry.title.$t,
                  thumbnail: data.entry.media$group.media$thumbnail[1].url,
                  duration: data.entry.media$group.yt$duration.seconds
                });
                this.model.videos.all(function(v) { return v.get('title') }) && this.doSave();
              } 
            });
          }, this);
      },

      doSave: function() {
        var self = this;
        this.model.save({ }, {
         
          success: function(resp, status, xhr) {
            window.location = self.model.url()  + "?code=updated";
          },

          on201: function( xhr) {
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "?code=saved";
            window.location=location;              
          }
        });
      },

      addGMapAutocompleter: function() {
        var $address = this.$('[name="address"]');
        this.autocomplete = new google.maps.places.Autocomplete($address[0]);
        $address.bind('keydown', function(e) { return e.keyCode != 13; }); // hack to avoid form submission when the user hits enter in an autocomplete option
        google.maps.event.addListener(this.autocomplete, 'place_changed', _.bind(this.onChangeGeo, this));
        this.renderGoogleMap();
      },

      /**
      Render just the Google map after async loading the JS library
      */
      renderGoogleMap: function() {

        // map, marker and infoWindow
        this.map = this.map || new google.maps.Map(this.$('.map')[0], {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 15
        });
        this.marker = this.marker || new google.maps.Marker({ map: this.map });
        this.infoWindow = this.infoWindow || new google.maps.InfoWindow();

        var view = this;
        google.maps.event.addListener(this.map, 'bounds_changed', function()  {
          view.autocomplete.setBounds(view.map.getBounds());
        });

        // create and position the map
        this.onChangeGeo();

      },

      onChangeGeo: function(e) {
        var address = this.$('[name="address"]').val()
          , place = this.autocomplete.getPlace()
          , view = this
          , location = GMaps.getLocation(place, this.model.get('geo'), function(location) {
            view.map.setCenter(location);
          });

        if (!location){
          return;
        }  
        if (this.map) {
          if (place && place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
          }
          
          // position map and marker 
          this.map.setCenter(location);
          this.marker.setPosition(location);

          // position the information window
          if (place && place.address_components) {
            address = '<b>' + place.name + '</b><br>' + address;
          }
          if (address) {
            this.infoWindow.setContent('<div>' + address + '</div>');
            this.infoWindow.open(this.map, this.marker);
          }
        }
    
        this.model.set({ 
          address: address,
          geo: { lat: location.lat() , lng: location.lng() }
        });
        this.$('.address-warn').remove();
        e && e.preventDefault();
      }

    })

});