// Create the map variable
var map;
//Create a blank array for all pre-defined location markers.
var markers = [];

function initMap() {
    // use a constructor to create a new map JS object.
    map = new google.maps.Map(document.getElementById('map'), {
 	  center: {lat: 33.963896, lng: -84.139585},
 	  mapTypeId: google.maps.MapTypeId.ROADMAP,
 	  mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
 	  zoom: 15
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
	
    // This function populates the infowindow when the marker is clicked. Only one
    // infowindow can be open at a time. It is populate based
    // on the markers information in the poiData.js file.
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
    	  showMarkers()
        // Add space in the infowindow content to allow the map to shift
    	  // else the map will not shift enough when real content arrives.
        infowindow.setContent('<div>' + marker.title + '</div>' +
        					'<br><br><br><br><br>' 
        					); 
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
          showMarkers()
        });
        // This function will use the marker data to retrieve Yelp data via a GET ajax call.
        function getYelpData(marker) {
    		$.ajax({
    			method: "GET",
    			headers: {"Accept":"*/*",
    				"Authorization": "Bearer 4MH965vAT8BdYrnpJ9sfq7SaTeL3lwP-NURptuo5pHomWo2KvvdqX1ovRdNHpT8Ax-y0Bw9DtoyXcqoCalaXNHxLnSicA1GsTh3UQOuqXi2rlVwFOgyoV3qB_DylXHYx"},
    			url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + marker.yelp_id,
    			dataType: "json",
    			success: function(businessDataJson) {  // Display the Yelp information
    				console.log(businessDataJson.rating);
    			 	infowindow.setContent('<div>' + marker.title + '</div>'+
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
    	              '<div>No Yelp Data Found</div>');
    			}	
    		});
        }
        // Call the function to get and display the Yelp information in an infowindow
        getYelpData(marker);
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
