angular.module('myApp', [])
.directive('myMap', ['$http', function($http) {
  // Directive Link Function
  var link = function($scope, element, attrs) {
    var map, infoWindow;
    $scope.markers = [];

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

    // Initialize the Map's Markers --- would be better to use a promise and subscribe to it
    // then we wouldn't have to have separate methods for getMarkers and initMarkers
    function initMarkers(map) {
      return $http.get('/markers').success(function(data) {
        angular.copy(data, $scope.markers);
        console.log(data);
        data.forEach(function(marker) {
          setMarker(map, new google.maps.LatLng(marker.lat, marker.lng), marker.title, marker.description);
        });
      });
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
      $scope.markers.push(marker); // Add Marker to the Array

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

    // ####### Scope Level Methods #######
    // Add a Marker to the Map
    $scope.addMarker = function(){
      var position = new google.maps.LatLng($scope.lat, $scope.lng);
      setMarker(map, position, $scope.title, $scope.content);
      console.log($scope.lat, $scope.lng, $scope.title, $scope.description);
      persistMarker($scope.lat, $scope.lng, $scope.title, $scope.description);
    }

    //####### API Related Methods ########
    // Save a Marker to the DB
    function persistMarker(lat, lng, title, content){
      var marker = {
        title: title,
        description: content,
        lat: lat,
        lng: lng
      }

      $http.post('/markers', marker).success(function(data){
        $scope.markers.push(data);
      });
    }

    // Get all Markers Saved in the DB
    function getMarkers() {
      return $http.get('/markers').success(function(data){
        angular.copy(data, $scope.markers);
      });
    }

    // ####### Call the Initialization Methods ###########
    // Show the Map
    initMap();
    // Show the markers
    initMarkers(map);
    // Set a Default Marker and Show it
    setMarker(map, new google.maps.LatLng(40.2518, -111.6493), 'BYU', 'Brigham Young University in Provo, Utah');
  };

  return {
    restrict: 'A',
    template: '<div id="gmaps"></div>',
    replace: true,
    link: link
  };
}]);
