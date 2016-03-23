

 //stores the name of the button into var select
// var queryURL = "http://api.yelp.com/v2/search/?" + what + '&' + where

// $.ajax({ 
//                 url: queryURL,
//                 method: 'GET'
//             })
//             .done(function(response) {

//                 console.log(response)
//                 var results = response.data
//             });

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
      'action': 'http://api.yelp.com/v2/search',
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
        // var output = prettyPrint(data);

    $("body").append("<h1>The best brunch spots are listed below: </h1>");
    $("body").append("<h1>");
    $("body").append(where);
    $("body").append("<\h1>");
    var i;
    //var imgsrc = "\<img src \=";
//var imgcl = "\">";
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

//********************************************************
