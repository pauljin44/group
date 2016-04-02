




//****************************************** Facebook SDK ******************************************************
var firebaseValueCheck = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
var firebaseCountUp = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/");
var FBwhat = []; 
var FBwhere = []; 
var FBYelpwhat; 
var FBresponse;
// var where = [] 
var fbAllFriendsList;
var allFriends = [];
var allFriendImg = [];
var fbPaging;
var facebookUserProfile = {};
var currentUser;
var userLikes = [];


$(document).ready(function(){

//************************* Submit function ************************************ 
    $('#submit').on('click', function() {
        // debugger;
        $('#searches').empty();
        $('#yelpSearches').show();
        loadYelpDiv()
        runYelp()
        return false

    });
 

    $('.dropdown').on('show.bs.dropdown', function(){
        var firebasePointsValue = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser+"/count");
        firebasePointsValue.on('value', function(snapshot){
            $('#points').empty();
            if (snapshot.val()===null)
                {$('#points').append('<li><p>Make an account or log in to track your LocalePoints!</p></li>');
            } else{
                $('#points').append('<li><p>You have '+snapshot.val()+' LocalePoints!</p></li>') 
            }   
        });

        var firebasePlacesValue = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser+"/places");
        firebasePlacesValue.once('value', function(snapshot){
            $("#exPlaces").empty();
            snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key();
                var childData = childSnapshot.val();
                $("#exPlaces").append('<li><p>'+childData+'</p></li>')
            });
        })
    });

    $(".well.well-lg").hide();
    $('#yelpSearches').hide();
});

    function loadYelpDiv(){
        console.log("makinitbigger")
        $(".well.well-lg").show();
    }

//****************************************Returning User Login******************************************
$('#modalOld').ready(function(){
    $('#oldUserSubmit').on('click', function() { 
        var test = $('#oldUser').val();
        var firebaseOldUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+test);
        firebaseOldUser.on('value', function(snapshot){
            if (snapshot.val() != undefined) {
                currentUser = $('#oldUser').val();   
            }else{
                console.log('currentUser login unsucessful')
            };
            currentUserFirebase = firebaseCountUp.child(currentUser);
            currentUserFirebase.on('value', function(snapshot){
                if (snapshot.val().count != undefined) {
                    localCounter = snapshot.val().count
                };
                if (snapshot.val().places != undefined){
                    checkedPlaces = snapshot.val().places
                };
                updateCounter();
            });
        });
        $('#oldUserSubmit').hide();   
    });    
});

//****************************************New User Login******************************************
$('#modalNew').ready(function(){
    $('#newUserSubmit').on('click', function(){
        $('#newUserSubmit').hide();
        newUser = $('#newUser').val();
        var firebaseNewUser = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+newUser)
        added = {
            dateAdded : Date.now(),   
        };
        firebaseNewUser.update(added);
        currentUser = newUser       
    }); 
});

//*************************************Facebook User Login******************************************    

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1518819868427496',
            cookie     : true,  // enable cookies to allow the server to access the session
                                                    
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use graph api version 2.5
        });
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
                document.getElementById('status').innerHTML = 'Please login';
            }
        };
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                console.log('you are logged in')

            } 
            statusChangeCallback(response);
        });
    }; 


//*************************************Facebook Graph API******************************************    

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
        }); 

    } 
    
//********************************************** Yelp *********************************************       


//****Searches Yelp with information from Submit Event ********
function runYelp() {

    locations = [];
    activeMarkers = [];
    if (activeMarkers.length > 0){clearMarkers()};
    
    
    what = $('#what').val();
    where = $('#where').val();
    
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
                };

                var j;

                for(j=0; j<=9; j= j+1){
                    newObject = ["" + data.businesses[j].name + "", "" + data.businesses[j].location.address[0]+ "" + " " + "" + data.businesses[j].location.city + "" + " " + "" + data.businesses[j].location.state_code, data.businesses[j].rating_img_url_small, "" + data.businesses[j].display_phone + "", data.region.center.latitude, data.region.center.longitude];
                    locations.push(newObject);
                };
                search();
            }
        });
    });
} 

//**************************************** Google Map API **************************************

var localCounter = 0; //initally set to 0
var checkedPlaces = []
  //Get to users
var currentUserFirebase = firebaseCountUp.child(currentUser);    //Get to current User 
   
function updateCounter(){
        var addCount = {›
            count: localCounter
        }
        currentUserFirebase = firebaseCountUp.child(currentUser);
        currentUserFirebase.update(addCount)
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

    // if (navigator.geolocation) {
    //     console.log("got it")
    //     navigator.geolocation.getCurrentPosition(function(position){
    //         console.log("caught it");
    //         console.log(position.coords.latitude);
    //         console.log(position.coords.longitude);
    //         var pos: {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };
    //         map.setCenter(pos);
    //     });
    // }else{ 
    //     console.log("Geolocation is not supported by this browser.");
    //     var altPos: {
    //         lat: 40.728,
    //         lng: -74.078
    //     };
    //     map.setCenter(altPos)
    // };     
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
            map.fitBounds(bounds);
            bounds.extend(marker.getPosition());
            // map.setCenter(center);
            // map.panTo(center);
            
        } else {
            alert ("geocode of" + address + "failed:" + status);
        }
      });
};


function updatePlaced(){
        
        var addPlaces = {
            places: {
                0: checkedPlaces[0].title 
            }
            
        }
        var firebasePlaceUp = new Firebase("https://sizzling-heat-1076.firebaseio.com/users/"+currentUser);

        firebasePlaceUp.once('value', function(snapshot){
            
            if (snapshot.val().places == undefined){
                firebasePlaceUp.update(addPlaces)
            }else{
                for(i=0;i<snapshot.val().places.length;i++){
                    addPlaces = {
                            [i+1]: checkedPlaces[0].title
                    }                           
                };
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
        var htmls= $("<div id='test' class='bubbleText'><h3>" + title + "</h3><p>" + address + "</p><img src="+"'"+ rating +"'><br><br><p>" + phone + "</p><br><button class='checkIn' name='checkIn' type='button'>I ate here!</button></div>");
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




