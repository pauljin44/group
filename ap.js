



//****************************************** Facebook SDK ******************************************************



  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log("return from login");
      console.log(response);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';

        FB.login(function(response) {
                    if (response.authResponse) {
                        console.log(response);
                        // var uid = response.authResponse.userID;
                        // var accessToken = response.authResponse.accessToken;
                        // getPermissions(uid);
                        // getUserAlbums(uid);
                        // getUserUploads(uid);
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                }, {scope: 'public_profile,email'});

    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1518819868427496',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  // FB.getLoginStatus(function(response) {
  //   statusChangeCallback(response);
  // });

FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    console.log(response);
    console.log('Logged in.');
  }
  else {
        console.log('Not Logged in.');

  }
});


  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
     console.log('Welcome!  Facebook SDK is fetching your information.... ');
    // FB.api('/me?fields=id,name,email,permissions,displayname', function(response) {
    //     console.log(response) //
    //     console.log('Successful Facebook login for: ' + response.name);
    //     console.log(response.email)
    //     document.getElementById('status').innerHTML =
    //         'Thanks for logging in, ' + response.name + '!';
    // },
    // {scope:'email'}
    // );

FB.api('/me', {fields: 'email'}, function(response) {
  console.log(response);
});

console.log("in testAPI");

            // FB.login(function(response){
            //     console.log("in response")
            // console.log(response);
            // }, {scope: 'email'})

  }






//***************************** firebase facebook user auth ******************************************


            // Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged into Facebook with Firebase with " + authData.provider);
    var ref = new Firebase("https://sizzling-heat-1076.firebaseio.com");
    user = {
       id: authData.uid, 
       provider: authData.provider
    }
    ref.push(user)
  } else {
    console.log("User is logged out of Facebook with Firebase");
  }
}

// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
ref.onAuth(authDataCallback);

$(function() {
    $('#fbLogin').click(function(){
        // debugger;

        var ref = new Firebase("https://sizzling-heat-1076.firebaseio.com");
        // prefer pop-ups, so we don't navigate away from the page
            ref.authWithOAuthPopup("facebook", function(error, authData) {
              if (error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                  // fall-back to browser redirects, and pick up the session
                  // automatically when we come back to the origin page
                  ref.authWithOAuthRedirect("facebook", function(error) { /* ... */ });
                }
              } else if (authData) {
                // user authenticated with Firebase
              }
            });

    });
});


//****************************************** Yelp ******************************************************       

$('#submit').on('click', function(){
    
    var what = "term=" + $(this).text()
    var where = 'location=' + $(this).text()
    
    what = $('#what').val()
    where = $('#where').val()
    



    var auth = {
  //
  // Update with your auth tokens.
  //
        consumerKey: "6D8kU6kuztsql0mF5fn1pQ",
        consumerSecret: "ySNfoa-0ET1HGydX3o8Y7Bk1Cjk",
        accessToken: "zV2TRcSIOG20IQjyXKOTWt4WKVKjX-c-",
        // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
        // You wouldn't actually want to expose your access token secret like this in a real application.
        accessTokenSecret: "vo_ufN9gSTYcqrUFjLcVfKYjXkM",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
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


    $("body").append("<h1>The best "+what+" spots are listed below: </h1>");
    $("body").append("<h1>");
    $("body").append(where);
    $("body").append("<\h1>");
    var i;

    for(i=0; i<=9; i= i+1){
                $("body").append("<p>");  
                $("body").append('<a href ="' + data.businesses[i].url + '">' + data.businesses[i].name +'</a>');
                $("body").append("      ");
                $("body").append('<img src="' + data.businesses[i].rating_img_url +'" />');
                $("body").append(" Phone: ");
                $("body").append(data.businesses[i].phone);
                $("body").append("<p>");  
                $("body").append(" Yelp Reviews: ");
                $("body").append(data.businesses[i].review_count);
                $("body").append("      ");
                $("body").append("<\p>");  
       }

      }
    })


});

//*************************************** foursquare ******************************************************            
        var clientId = 'B1I4ZQXNFKNTWZFSJ4R21TOXNAUDZMVZCYWX5QOOY41XAQ5S'
        var clientSecret = 'P0EFXQABILXQM5OI4QPZT42BLV0ML12ROKVZIOQWIQ0X5FBV'
        var foursquareRedirect = 'https://polar-mesa-92767.herokuapp.com'
        var fourSquareAuth = 'https://foursquare.com/oauth2/authenticate?client_id='+clientId+'&response_type=code&redirect_uri='+foursquareRedirect
        // debugger;
        var code = ''
        var thisURL = ''
        

//****** When button is clicked take clientID, and redirect to get code *************************************        
//         $('#logFoursquare').on('click', function(){
//             // debugger;
//             var fourAuthWin = window.open(fourSquareAuth, '_blank'); 
            
//             fourAuthWin;
//             return 
//             // code = window.location.href.split('code=')
//             // code = code[1]            
//         });
               
//         thisURL = window.location.href //grab URL with code at end
//         code = thisURL.replace('https://polar-mesa-92767.herokuapp.com/?code=','').replace('#_=_', '') //remove everything but the code
//         // window.location.href = 'https://polar-mesa-92767.herokuapp.com/'



//         var getToken = 'https://foursquare.com/oauth2/access_token?client_id='+clientId+'&client_secret='+clientSecret+'&grant_type=authorization_code&redirect_uri='+foursquareRedirect+'&code='+code
//         var fourSquareAccessToken

// //****************** When you have to code, send it back out to get a token for access ************************       
        
//         if (code != 'https://polar-mesa-92767.herokuapp.com/') {

//             $.ajax({
//                     url: getToken,
//                     method: 'GET'
//                 })
//                 .done(function(response) {
//                     console.log('this is access token: ', response.access_token)
//                     fourSquareAccessToken = response.access_token;

//                 });
//         }



//         // var queryURL = 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&'+clientId+'&client_secret='+clientSecret+'&v=20160323'

//         // $.ajax({ 
//         //         url: queryURL,
//         //         method: 'GET'
//         //     })
//         //     .done(function(response) {
//         //         // debugger;
//         //         console.log('response: '+response)
//         //         var results = response.data
//         //     });


