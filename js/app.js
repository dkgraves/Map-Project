// Create the map variable
var map;
//Create a blank array for all pre-defined location markers.

function ViewModel() {

	var self = this;
	// empty array for markers
	this.markers = [];
	// empty search for the list of markers
	this.searchText  = ko.observable("");

	 // This function populates the infowindow when the marker is clicked. Only one
    // infowindow can be open at a time. It is populate based
    // on the markers information in the poiData.js file.
    this.populateInfoWindow = function(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {

        // Add blank lines height and width in the infowindow content to allow the map to shift if needed
    	  // else the map will not shift enough when real content arrives and infowindow
    	  // will be outside the viewing area.
        infowindow.setContent('<div>' + marker.title + '</div>' +
        					'<br><pre>                                    </pre>' +
        					'<br><br><br><br>' 
        					); 
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;

        });
        // This will use the marker data to retrieve Yelp data via a GET ajax call.
       // NOTE that if this is run from a local PC and not under a web server line 39 will need to replace line 40 due to cors issues with Yelp.  
		$.ajax({
			method: "GET",
			headers: {"Accept":"*/*",
				"Authorization": "Bearer 4MH965vAT8BdYrnpJ9sfq7SaTeL3lwP-NURptuo5pHomWo2KvvdqX1ovRdNHpT8Ax-y0Bw9DtoyXcqoCalaXNHxLnSicA1GsTh3UQOuqXi2rlVwFOgyoV3qB_DylXHYx"},
			//url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + marker.yelp_id,
			url: "https://api.yelp.com/v3/businesses/" + marker.yelp_id,
			dataType: "json",
			success: function(businessDataJson) {  // Display the Yelp information
				if(businessDataJson.hours.is_open_now) {
					var openClosed = 'Closed'
				} else
					var openClosed = 'Open'

				console.log(businessDataJson.rating);
			 	infowindow.setContent('<div>' + marker.title + '&nbsp;--->&nbsp;' + openClosed + '&nbsp; Now</div>'+
			 			'<div><img src=./img/small_' + businessDataJson.rating + '.png>&ensp;' + businessDataJson.review_count +' reviews</div>' +
			 			'<div>' + businessDataJson.categories[0].title + '</div>' +
			 			'<div>' + businessDataJson.location.display_address + '</div>' +
			 			'<div>' + businessDataJson.display_phone + '</div>' +
			 			'<a href=' + businessDataJson.url + ' target=_blank>' +
			 				'<img src=./img/Yelp_trademark_RGB_outline.png alt=Yelp Trademark style=height:54px>' +
			 			'</a>'
			 			);
			},
			error: function(e) {
				console.log("Response error " + e.message)
				infowindow.setContent('<div>' + marker.title + '</div>' +
	              '<div>Error encountered retrieving Yelp information</div>');
			}
		});

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
    };

	
    this.initMap = function() {
    // use a constructor to create a new map JS object.
    	map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 33.963896, lng: -84.139585},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			zoom: 15
    	});

    	var bounds = new google.maps.LatLngBounds();

	    this.detailsInfowindow = new google.maps.InfoWindow();
    // The following loop uses the location array to create an array of markers on initialize.
	    for (var i = 0; i < locations.length; i++) {
	    	// Get the position from the location array stored in the poiData.js file.
	    	var name = locations[i].name;
	    	var category = locations[i].category;
	    	var position = locations[i].location;
	    	var yelp_id = locations[i].yelp_id;
			console.log(position)
			console.log(name)
			// Create a marker for each location, and put it into the markers array.
			var marker = new google.maps.Marker({
				map: map,
			    position: position,
			    category: category,
			    title: name,
			    yelp_id: yelp_id,
			    animation: google.maps.Animation.DROP,
			    id: i
				});
		// Push the marker to an array of markers.
		this.markers.push(marker);
		// Create an onclick event to open the details infowindow for each marker.
        marker.addListener('click', function() {
          self.populateInfoWindow(this, self.detailsInfowindow);
          this.setAnimation(google.maps.Animation.BOUNCE);
          // stop bouncing after xxxx milliseconds
          setTimeout((function() {this.setAnimation(null);}).bind(this), 1500);
        });
        bounds.extend(this.markers[i].position);
	    }
		// Make the markers fit inside the map by extending the boundaries
	    map.fitBounds(bounds);

    };

    // This function is used in the index.html page to launch the infowindow
    // when a link in the list of locations is selected.
    this.listLocationSelect = function(){
        self.populateInfoWindow(this,self.detailsInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
		// stop bouncing after xxxx milliseconds
            setTimeout((function() {this.setAnimation(null);}).bind(this), 1500);

    };

    this.initMap();

    this.detailsInfowindow.close();

    // This function will use the filter value on the index.html page to
    // select the correct markers to display.
    this.listLocations = ko.computed(function() {
    	var bounds = new google.maps.LatLngBounds();;
    	this.detailsInfowindow.close();
    	var result = [];
        for (var i = 0; i < this.markers.length; i++)
            if ((this.markers[i].category.toUpperCase().includes(this.searchText().toUpperCase())) || (this.searchText() == "ALL")){
                result.push(this.markers[i]);
                this.markers[i].setVisible(true);
                bounds.extend(this.markers[i].position);
            }
            else
                this.markers[i].setVisible(false);
        	map.fitBounds(bounds);
        	return result;
        }, this);
}
// This is the callback function to load the maps after Google responds to the request and set up knockout bindings.
function buildMap() {
    ko.applyBindings(new ViewModel()); // call the viewModel and apply bindings
}

function googleError() {
	alert("Error loading Google Maps, unable to load the map");
}
	
