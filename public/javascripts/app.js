angular.module('myApp', [])
.directive('myMap', function() {
  // Directive Link Function
  var link = function(scope, element, attrs) {
    var map, infoWindow;
    var markers = [];

    // Map Config
    var mapOptions = {
      center: new google.maps.LatLng(40.2518, -111.6493),
      zoom: 10,
      mapTypeId: 'roadmap',
      scrollwheel: true
    };

    // Initialize the Map
    function initMap() {
      if(map === void 0) {
        map = new google.maps.Map(element[0], mapOptions);
      }
    }

    // Place a marker
    function setMarker(map, position, title, content) {
      var marker;
      var markerOptions = {
        position: position,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      };

      marker = new google.maps.Marker(markerOptions);
      markers.push(marker); // Add Marker to the Array

      google.maps.event.addListener(marker, 'click', function() {
        // Close the Window if it isn't Undefined (it's open)
        if(infoWindow !== void 0){
          infoWindow.close();
        }

        // Create a New Window
        var infoWindowOptions = {
          content: title + ": " + content
        };
        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        infoWindow.open(map, marker);
      });
    }

    // Show the Map
    initMap();

    // Set a Marker
    setMarker(map, new google.maps.LatLng(40.2518, -111.6493), 'BYU', 'Brigham Young University in Provo, Utah');
  };

  return {
    restrict: 'A',
    template: '<div id="gmaps"></div>',
    replace: true,
    link: link
  };
});
