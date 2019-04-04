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
    
    // Set the attributes of the default marker and mouse out from the marker.
    var defaultIcon = makeMarkerIcon();

    // Set the attributes of a marker for mouse over the marker.
    var highlightedIcon = makeMarkerIcon();

    function makeMarkerIcon() {
        var markerImage = new google.maps.MarkerImage(
        		'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png',	
          new google.maps.Size(55, 55),
          new google.maps.Point(0, 0),
          new google.maps.Point(0, 0),
          new google.maps.Size(55,55));
        return markerImage;
      }
    
    // The following loop uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array stored in the poiData.js file.
    	var name = locations[i].name;
    	var position = locations[i].location;
    	var label = locations[i].label;
		console.log(position)
		console.log(name)
		// Create a marker for each location, and put it into the markers array.
		var marker = new google.maps.Marker({
		    position: position,
		    title: name,
		    label: label,
		    animation: google.maps.Animation.DROP,
		    id: i
		
		});
		// Push the marker to an array of markers.
		markers.push(marker);
		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
		populateInfoWindow(this, largeInfowindow);
		});
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
		this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
		this.setIcon(defaultIcon);
		});
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