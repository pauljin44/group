



//****************************************** Facebook SDK ******************************************************
var firebaseValueCheck = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
var FBwhat = []; 
var FBwhere = []; 
var FBYelpwhat; 
var what = [];
var where = [];
var FBresponse; 
var fbAllFriendsList;
var allFriends = [];
var allFriendImg = [];
var fbPaging;
var facebookUserProfile = {};
var currentUser;

//************************* Submit function ************************************ 

$('#submit').on('click', function() {

    $('#searches').empty();
    what = $('#what').val();
    where = $('#where').val();
    $('#yelpSearches').show();
    runYelp()

});

$('#oldUserSubmit').on('click', function() {

    firebaseValueCheck.on('value', function(snapshot){
        var test = $('#oldUser').val()
        test = test.replace(/(^")|("$)/g, '')
        
        if (snapshot.val().users.test == true) {
            currentUser = $('#oldUser').val();
            console.log();
        }

    });

    
});

$('#newUserSubmit').on('click', function(){
    
    newUser = $('#newUser').val();
    var firebaseNewUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+newUser)
    added = {
        dateAdded : Date.now()
    }
    firebaseNewUser.update(added);
    firebaseValueCheck.once('value', function(snapshot) {
        console.log(snapshot.val().users.newUser)
    }) 

    currentUser = newUser       
});

    

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1518819868427496',
            cookie     : true,  // enable cookies to allow the server to access the session
                                                    
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use graph api version 2.5
        });





        // The response object is returned with a status field that lets the app know the current login status of the person.
         
        function checkLoginState() {
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        }


        function statusChangeCallback(response) {

            if (response.status === 'connected') {

                testAPI();

            } else if (response.status === 'not_authorized') {
                
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
            } else {

                document.getElementById('status').innerHTML = '';
            }
        }

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                console.log('you are logged in')
                
            } 
            statusChangeCallback(response);
        });

    
    }; //close window.fbAsyncInit

    

    // Load the SDK asynchronously 
    // (function(d, s, id) {
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) return;
    //     js = d.createElement(s); js.id = id;
    //     js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1518819868427496";
    //     fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));

    // FB Graph API
    


    var userLikes = [];
    function testAPI() {

        FB.api('/me','GET', {"fields":"id,name,email,likes,friends,invitable_friends{id,picture,name},location"},function(response) {
                    console.log('This is FB Graph API response: ', response);
                    
            fbPaging = response.invitable_friends.paging.next
                // fbFriendImg = response.invitable_friends.data.picture.data.url

            fbAllFriendsList = fbPaging.replace('limit=25', 'limit=5000');

                   

            FB.api(fbAllFriendsList, function(response) {  
                console.log(response);
                
                for (x=0;x<response.data.length;x++) {
                    allFriends.push(response.data[x].name);
                    allFriendImg.push(response.data[x].picture.data.url)


                }
                
                for(a=0;a<allFriends.length;a++){ 
                    // debugger;

                    facebookUserProfile.userFriends[a] = [allFriends[a], allFriendImg[a]]
                }

                var newFirebaseUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+facebookUserProfile.userName);
                // debugger;
                newFirebaseUser.set(facebookUserProfile);   

            });



                        

            facebookUserProfile = { 
                userName: response.name,
                userID: response.id,
                userEmail: response.email,
                userFriends: {},
                userLikes: {}
            }

            currentUser = response.name;



            var newFirebaseUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+response.name);
            
            newFirebaseUser.set(facebookUserProfile); 
            
            

            if (response.likes.data.length != undefined) { 
                
                for (h=0;h<response.likes.data.length;h++) {
                // var userLikes = []
                 userLikes.push(response.likes.data[h].name);
                }

                for(b=0;b<userLikes.length;b++){ 
                    // debugger;

                    facebookUserProfile.userLikes[b] = userLikes[b]
                }

                var newFirebaseUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+facebookUserProfile.userName);
            
                newFirebaseUser.set(facebookUserProfile); 
            }

            where.push(response.location.name); //where your location is

        }); 

    } //end Test api
                
                // FBwhere = where[0]; //this is a runYelpOnce() var

                //  if (userLikes.length > 0) { 
                //      for (k=0;k<what.length;k++) {
                //          FBwhat = userLikes[k] //this is a runYelpOnce() var
                //          runYelpOnce()
                //      }

                //  }





    // }    
    
    $('#yelpSearches').hide();

//****************************************** Yelp ******************************************************       

function runYelp() {

        

    firebaseValueCheck.once('value', function(snapshot) {
            var auth = {

                consumerKey: snapshot.val().yelp.consumerKey,
                consumerSecret: snapshot.val().yelp.consumerSecret,
                accessToken: snapshot.val().yelp.accessToken,
                accessTokenSecret: snapshot.val().yelp.accessTokenSecret,
                serviceProvider: {
                        signatureMethod: snapshot.val().yelp.serviceProvider.signatureMethod
                    }
            };



        var accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
        };

        parameters = [];
        parameters.push(['term', what]);
        parameters.push(['location', where]);
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = {
            'action': 'https://api.yelp.com/v2/search',
            'method': 'GET',
            'parameters': parameters
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
        console.log(parameterMap);

        var bestRestaurant = "Some random restaurant";

        $.ajax({
            'url': message.action,
            'data': parameterMap,
            'cache': true,
            'dataType': 'jsonp',
            'jsonpCallback': 'cb',
            'success': function(data, textStats, XMLHttpRequest) {
            console.log(data);


                $('.panel-title').text('The best '+what+' spots in '+where+' are listed below').css('text-align', 'center');
                $("#searches").addClass('table table-hover')
                
                var i;

                for(i=0; i<=9; i++){
                    
                    if (data.businesses[i].is_claimed) {
                        var isClaimed = 'yes'       
                    }else{
                        isClaimed = 'no'
                    }

                    $("#searches").append("<tr class="+i+">"+'<td>'+'<a href='+data.businesses[i].url+">"+data.businesses[i].name +"</a>"+'</td>');
                    $("."+i).append('<td>'+'<img src='+ data.businesses[i].rating_img_url+'>'+'</td>');
                    $("."+i).append('<td>Phone: '+data.businesses[i].phone+'</td>');
                    $("."+i).append('<td>Is this claimed by owner: '+isClaimed+'</td>'+'</tr>'); 
                    $("."+i).append("<br />"); 
                }

            }
        
        });

    });
} //end runYelp() *********************

//************************ Google map api **************************************
search();



var localCounter = 0; //initally set to 0
var checkedPlaces = []

var firebaseValueCheck = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
    
    firebaseValueCheck.on('value', function(snapshot){
        if (snapshot.val().userName != undefined) {
            localCounter = snapshot.val().userName.count
        }
        if (snapshot.val().userName.places != undefined){
            checkedPlaces = snapshot.val().userName.places
        }


        
    });

var firebaseCountUp = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser);


function updateCounter(){

        var addCount = {
            count: localCounter,
        }
        
        firebaseCountUp.update(addCount)
        $("#counter").empty();      
        $("#counter").html("<p>You have this many points:" + localCounter+ "</p>");

};


// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//         console.log("got it");
//     } else {
//         console.log("Geolocation is not supported by this browser.");
//     }
// }
// function showPosition(position) {
//  console.log("caught it");
//    console.log("Latitude: " + position.coords.latitude + 
//     "Longitude: " + position.coords.longitude); 
// }







if (navigator.geolocation) {
    
        navigator.geolocation.getCurrentPosition(getCoordinates);
        console.log("got it");
    } else { 
        console.log("Geolocation is not supported by this browser.");
    };





function getCoordinates(position) {
    console.log("caught it");
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
};

var map;
var activeMarkers = [];
var locations = [];

google.maps.event.addDomListener(window, "load", initMap);

function setMapOnAll(map) {
  for (var i = 0; i < activeMarkers.length; i++) {
    activeMarkers[i].setMap(map);
  }
};

function clearMarkers() {
    setMapOnAll(null)
};

function initMap() {    
      map = new google.maps.Map(
        document.getElementById('map'), {
          center: {lat: 40.728, lng: -74.078},
          zoom: 12
        });     
};

function search(){
geocoder = new google.maps.Geocoder();
for (i = 0; i < locations.length; i++) {
            geocodeAddress(locations, i)
        };
map.panTo(center)
};

var marker;
var center = {};

function geocodeAddress(locations, i) {

      var title = locations[i][0];
      var address = locations[i][1];
      var rating = locations[i][2];
      var phone = locations[i][3];
      center = {};
      center.lat = locations[i][4];
            center.lng = locations[i][5];

      geocoder.geocode({
        'address': locations[i][1]
      }, function(results, status){

        if (status == google.maps.GeocoderStatus.OK){

            marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title,
                animation: google.maps.Animation.DROP,
                address: address, 
                rating: rating,
                phone: phone,
                center: center
            });
            activeMarkers.push(marker);
            infoWindow(marker, map, title, address, rating, phone);
            bounds.extend(marker.getPosition());
            // map.setCenter(center);
            // map.panTo(center);
            map.fitBounds(bounds);
        } else {
            alert ("geocode of" + address + "failed:" + status);
        }
      });
};


function updatePlaced(){
        
        $("#lastplace").html("<p>You were last at: " + checkedPlaces[0].title+ "</p>");
        
        var addPlaces = {
            
            places: {
                0: [checkedPlaces[0].title] 
            }
            
        }
        var firebasePlaceUp = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser);
        
        firebasePlaceUp.once('value', function(snapshot){
            debugger;
            if (snapshot.val().places == undefined){
                firebasePlaceUp.update(addPlaces)

            }else{
                for(i=0;i<snapshot.val().places.length;i++){
                    addPlaces = {

                            [i+1]: checkedPlaces[0].title
                        }                           
                    } 

                    var firebasePlaceDown = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser+"/places");
                            

                    firebasePlaceDown.update(addPlaces)
                }


            
        });
        
        

};

var infoBubble = null;

var thisPlace;


function infoWindow(marker, map, title, address, rating, phone){
    checkedPlaces = [];
    google.maps.event.addListener(marker, 'click', function(){
        if (infoBubble) {
            infoBubble.close();
        };

        var htmls= $("<div id='test'><h3>" + title + "</h3><p>" + address + "</p><img src="+"'"+ rating +"'><br><p>" + phone + "</p><br><button class='checkIn' name=:'checkIn' type='button'>I ate here!</button></div>");
        infoBubble = new InfoBubble({
            content: htmls[0],
            maxWidth: 350,
            shadowStyle: 1,
            backgroundColor: 'slategrey'
        });

        infoBubble.open(map,marker);

        var checkBtn = htmls.find('button.checkIn')[0];
        

        google.maps.event.addDomListener(checkBtn, "click", function(event) {
                console.log("hi!");
                localCounter++;
                console.log(localCounter);
                updateCounter();
                thisPlace = {
                        title: title,
                        address: address,
                        phone: phone
                  };
                  console.log(thisPlace);
                checkedPlaces.unshift(thisPlace);
                console.log(checkedPlaces); 
                updatePlaced();
        });

        

    });
} 





