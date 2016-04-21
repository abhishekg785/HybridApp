angular.module('starter.controllers', [])
//controller for the home page that display a web page at the starting and uses WEBVIEW or cordova InAppBrowser
.controller('DashCtrl', function($scope,$ionicPlatform,$ionicLoading) {
  $ionicPlatform.ready(function(){
  //this method will be used to open facebook on the button click at web view
  cordova.InAppBrowser.open("http://www.facebook.com/", '_self');
  $ionicLoading.hide();
  });
  $scope.openweb = function(){
    cordova.InAppBrowser.open("http://www.facebook.com/", '_self');
  };
})

//controller for displaying all the device messages
.controller('MessageController',function($scope){
  $scope.title = "Messages";
})

//controller for showing the contacts of the device
.controller('ContactController',function($scope,$cordovaContacts,$timeout,$ionicLoading,Services,$http){
  $scope.contactArr = [];
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $cordovaContacts.find({filter: ''}).then(function(result){
    $scope.contactArr = result;
    Services.setContacts(result);


    //for sending fetched contacts to server
    // Services.postData(result);  //calling the postData function defined in services.js


  }, function(error) {
      console.log("ERROR: " + error);
     });
  $timeout(function (){
    $ionicLoading.hide();
    $scope.contacts = $scope.contactArr;
  }, 3000);
})

//controller for displaying teh current location of the user's device
.controller('LocationController',function($scope,$cordovaGeolocation,$ionicPlatform,$ionicLoading,Services){
  //to retrieve the deivice ready state
  $ionicPlatform.ready(function() {
    //loader for loading the cordinates
  $scope.contactArr = [];
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  // controller for finding the coordinates
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
   .getCurrentPosition(posOptions)
   .then(function (position) {
     var lat  = position.coords.latitude
     var long = position.coords.longitude
     $scope.lat = 'Latitude: '+ lat;
     $scope.long = 'Longitude: '+ long;
     //creating object to set the coordinates in the service.js to send the data when fetchded completely
     var cordObj = {
       'lat':lat,
       'long':long
     };
     Services.setLocation(cordObj);


     //for sending fetched coordinates to server
     // Services.postData(cordObj);  //calling the postData function defined in services.js


     $ionicLoading.hide();
     //after getting the coordinates we use map to show location
     var myLatlng = new google.maps.LatLng(lat,long);
     var mapOptions = {
       center : myLatlng,
       zoom : 16,
       mapTypeId : google.maps.MapTypeId.HYBRID
     };
     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     $scope.map = map;
     $ionicLoading.hide();
   }, function(err) {
     console.log(err);
     alert('Internet Connection Required!!!');
   });

 });
})

.controller('SendDataController',function($scope,$http,Services){
    $scope.postDataResponse = "Not sent yet";
    $scope.location = Services.getLocation();
    $scope.contacts = Services.getContacts();
    var data = {
      'location':$scope.location,
      'contacts':$scope.contacts.contacts
    };
    var url = "dummy@server.com";
    var config = {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8; '
      }
    }
    //function for sending the data once it is fetched
    $scope.sendData = function(){
      $http.post(url,data,config)
      .success(function(data,status,header,config){
        $scope.postDataResponse = "Data Sent " + data;
      })
      .error(function(data,status,header,config){
        $scope.postDataResponse = "Error occured " + data;
      });
    };
});
//controller for sending the fetched details to another server
