
define([ 'core', 'hbs!./instructorview', 'lib/gmaps', 'videos/videomodel', 'videos/videoscollectionview',  ], 
  function(Core, template, GMaps, VideoModel, VideoCollectionView) {

    return Backbone.View.extend({

      events: {
        'submit form#instructorForm': 'save',
        'click #delete' : 'delete',
 
        'change input': function(e) {
          if ("address" === e.srcElement.name){
            this.model.unset('geopoint');
          }
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },
        'change textarea': function(e) {
          var $ct = $(e.currentTarget);
          this.model.set($ct.attr('name'), $ct.val());
        },
        'change input.checkbox' : function(e){
          if (e.currentTarget.checked){
            this.model.attributes.courses.push(e.currentTarget.value);
          } else  {
            this.model.attributes.courses = _.without(this.model.attributes.courses, e.currentTarget.value);
          }
        }
      },

   

      render: function() {
        this.$el.html( template( { instructor: this.model.toJSON(), courses: this.options.courses}));
        if (this.model.attributes.id) {
          $.map(this.model.attributes.courses, function(item){ 
            var query = 'input[name=courses_' + item + ']';
            $(this.$(query)[0]).attr('checked', true);
            });
        }

        // Carga la librería GoogleMaps
        GMaps.loadMapsAPI(this.addGMapAutocompleter, this);

        var videos = new Backbone.Collection([], { model: VideoModel });
        videos.url = '/instructors/' + this.model.attributes.id + '/videos';

        window.instructorView = this;
        window.courses = this.options.courses;
        
        var instructor = this.model;
        videos.fetch({ 
          success: function(collection, response){
              window.videoCollectionView = new VideoCollectionView({
                collection: collection,
                instructorId:  window.instructorView.model.attributes.id,
                instructorName: window.instructorView.model.attributes.name,
                courses: window.courses,
                el: $('.videos')
              });
              window.videoCollectionView.render();
          }
        });

        return this;
      },


      save: _.throttle(function(e) {
        e.preventDefault();
        if ( !this.model.get('geopoint')){
          this.marker.setVisible(false);
          this.infoWindow.close();
          Core.renderMessage({ level :'warn',  message :'Address not found' });
          return;
        }
        Core.loadingButton($('#send'), true);
        this.doSave();
      }, 1000),

      doSave: function() {
        var self = this;
        this.model.save({ }, {
          success: function(resp, status, xhr) {
            if (window.videoCollectionView.collection.length > 0) {
              window.videoCollectionView.save();
            } else {
               Core.renderMessage({ level :'success',  message :'Instructor saved' });
               Core.loadingButton($('#send'), false);
            }
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

      delete: function(e){
        var self=this;
        this.model.destroy({
          success: function(resp, status, xhr) {
            window.location=self.model.urlRoot+ "/#deleted";;
          }
        });
        e.preventDefault();
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
          this.model.unset('geopoint');
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
      }

    })

});
