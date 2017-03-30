angular.module('myApp', [])
.directive('myMap', ['$http', function($http) {
  // Directive Link Function
  var link = function($scope, element, attrs) {
    var map, infoWindow;
    $scope.markers = [];
    $scope.error = null;

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
      if (!areValidCoordinates($scope.lat, $scope.lng)) {
        $scope.error = 'Invalid coordinates'
        return;
      }
      var marker = {
        title: $scope.title,
        description: $scope.description,
        lat: $scope.lat,
        lng: $scope.lng
      }
      persistMarker(marker)
        .then(function() {
          $scope.error = null;
          var position = new google.maps.LatLng($scope.lat, $scope.lng);
          setMarker(map, position, $scope.title, $scope.content);
          $scope.moveToLocation(marker);
          clearForm();
        })
        .catch(function (response) {
          console.log(response);
          if ('data' in response && 'error' in response.data) {
            $scope.error = response.data.error;
          }
        })
    }

    window.createDefaultLocations = function() {
      var markers = [
        {title: 'BYU', description: 'Brigham Young University, Provo', lat: '40.2518', lng: '-111.6493'},
        {title: 'Madrid', description: 'Capital of Spain', lat: '40.4168', lng: '-3.7038'},
        {title: 'Area 51', description: '"aliens"', lat: '37.2416', lng: '-115.8112'},
        {title: 'Mount Everest', description: 'Tallest mountain on earth', lat: '27.9878', lng: '86.9250'},
      ];
      markers.forEach(persistMarker);
    }

    //####### API Related Methods ########
    // Save a Marker to the DB
    function persistMarker(marker) {
      return $http.post('/markers', marker)
        .then(function (response) {
          $scope.markers.push(marker)
        })
    }

    // Get all Markers Saved in the DB
    function getMarkers() {
      return $http.get('/markers').success(function(data){
        angular.copy(data, $scope.markers);
      });
    }

    $scope.moveToLocation = function(marker){
      var center = new google.maps.LatLng(marker.lat, marker.lng);
      map.panTo(center);
    }

    // ####### Call the Initialization Methods ###########
    // Show the Map
    initMap();
    // Show the markers
    initMarkers(map);
    // Set a Default Marker and Show it
    // setMarker(map, new google.maps.LatLng(40.2518, -111.6493), 'BYU', 'Brigham Young University in Provo, Utah');
    function clearForm() {
      $scope.description = '';
      $scope.title = '';
      $scope.lat = '';
      $scope.lng = '';
    }

    function areValidCoordinates(lat, lng) {
      var latNum = parseFloat(lat);
      var lngNum = parseFloat(lng);
      return latNum !== NaN &&
        lngNum !== NaN &&
        latNum >= -90 && latNum <= 90 &&
        lngNum >= -180 && lngNum <= 180;
    }

    // if ($scope.markers.length > 0) {
    //   $scope.moveToLocation(markers[0]);
    // }
  };

  return {
    restrict: 'A',
    template: '<div id="gmaps"></div>',
    replace: true,
    link: link
  };
}]);
