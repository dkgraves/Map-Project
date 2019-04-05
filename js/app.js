// Create the map variable
var map;
//Create a blank array for all pre-defined location markers.
var markers = [];

function initMap() {
    // use a constructor to create a new map JS object.
    map = new google.maps.Map(document.getElementById('map'), {
 	  center: {lat: 33.963896, lng: -84.139585},
 	  zoom: 17
 	 });
    
    var detailsInfowindow = new google.maps.InfoWindow();
    // The following loop uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array stored in the poiData.js file.
    	var name = locations[i].name;
    	var position = locations[i].location;
    	var label = locations[i].label;
    	var yelp_id = locations[i].yelp_id
		console.log(position)
		console.log(name)
		// Create a marker for each location, and put it into the markers array.
		var marker = new google.maps.Marker({
		    position: position,
		    title: name,
		    label: label,
		    yelp_id: yelp_id,
		    animation: google.maps.Animation.DROP,
		    id: i
		
		});
		// Push the marker to an array of markers.
		markers.push(marker);
		// Create an onclick event to open the details infowindow for each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, detailsInfowindow);
        });	
    }
	
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give yelp data time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
        
        function getYelpData(marker) {
    		$.ajax({
    			method: "GET",
    			headers: {"Authorization": "Bearer "},
    			url: "https://api.yelp.com/v3/businesses/" + marker.yelp_id,
    			dataType: "json"
    			
    		});
        	
        	
        	if (status == "200") {  
            
              infowindow.setContent('<div>' + marker.title + '</div><div id="yelp"></div>');
              
          
            
          } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Yelp Data Found</div>');
          }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
    }

    
 // This function will loop through the markers array and hide them all.
    function hideMarkers() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }
	// This function will loop through the markers array and display them all.  
    function showMarkers() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
    showMarkers();
  }