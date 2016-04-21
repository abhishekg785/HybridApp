angular.module('starter.services', [])
//i will be using this to get and set  values for all the controllers in the app
//what i will be doing here is getting all the values when set and sending them to a dummy server
.factory('Services',function($cordovaContacts,$http){
  var contacts = {};
  var location = {};
  return {
    getNames:function(){
      return name;
    },
    setLocation:function(cordObj){
      location = cordObj;
    },
    getLocation:function(){
      return location;
    },
    setContacts:function(contactObj){
      contacts = contactObj;
    },
    getContacts:function(){
      //alert(contacts);
      var contactObj = {
        'contacts':contacts
      };
      return contactObj;
    },
    postData:function(data){
      var url = "dummy@server.com";
      var config = {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8; '
        }
      };
      $http.post(url,data,config)
      .success(function(data,status,header,config){
        console.log(data);
      })
      .error(function(data,status,header,config){
        console.log(data);
      });
    }
  }
});
