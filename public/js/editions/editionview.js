define([ 'core', 'hbs!./editionview', 'lib/gmaps' ], 
  function(Core, template, GMaps ) {

    return B.View.extend({

      events: {
        'click .delete'         : 'delete',
        'submit form'           : 'save',
        'change input, select'  : 'onChange'
      },

      render: function() {
        this.$el.html( template( {
          edition: this.model.toJSON(),
          instructors : this.options.instructors,
          course : this.options.course,
          certificates : this.options.certificates,
          isAdmin: this.options.isAdmin
        })); 
        this.$("select[name=instructorId]").val(this.model.attributes.instructorId);
        this.$("select[name=state]").val(this.model.attributes.state);

        GMaps.loadMapsAPI(this.addGMapAutocompleter, this);

        return this;

      },

      onChange : function(e) {
        if ("address" === e.srcElement.name){
          this.model.unset('geopoint');
        }
        var $ct = $(e.currentTarget);
        this.model.set($ct.attr('name'), $ct.val());
      },

      save: function(e) {
        e.preventDefault();

        if ( !this.model.get('geopoint')){
          this.marker.setVisible(false);
          this.infoWindow.close();
          Core.renderMessage({ level :'warn',  message :'Address not found' });
          return;
        }

        this.model.save({}, {
          success: function(resp, status, xhr) {
            location.href = resp.url() + "/#updated";
          },

          on201: function(xhr){
            // Http status Ok, Created
            var location = xhr.getResponseHeader("location") + "/#saved";
            window.location.href=location;              
          }
        });
      },

      delete: function(){ 

        var self = this;

        this.model.urlRoot = '/admin/courses/' + this.model.get('course') + '/editions'
        this.model.destroy({
          success: function() {
            location.href = '/courses/'+ self.options.course.uuid + '/#deleted';
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
          , geopoint = this.model.get('geopoint')
          , loc = GMaps.getLocation(place, geopoint, function(loc) {
              view.map.setCenter(loc);
            });

        $($('input:submit')[0]).prop('disabled', !loc);

        if (!loc){
          this.marker.setVisible(false);
          this.infoWindow.close();
          Core.renderMessage({ level :'warn',  message :'Address not found,ill not be shown on the map' });
          this.model.set({geopoint:{}})
          return;
        }  
        
        this.model.set({ 
          address: address,
          geopoint: { 
            lat: loc.lat(), 
            lng: loc.lng(),
            }
          }
        );

        
        if (place && place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setZoom(9);
        }

        // position map and marker 
        this.map.setCenter(loc);
        this.marker.setPosition(loc);
        
       
        if (geopoint && geopoint.lat && geopoint.lng) {
            this.marker.setVisible(true);
            this.infoWindow.setContent('<div>' + address + '</div>');
            this.infoWindow.open(this.map, this.marker);
        } else {
            this.marker.setVisible(false);
             this.infoWindow.close();
        }

        e && e.preventDefault();
      },

    })

});