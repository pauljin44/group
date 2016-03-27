



//****************************************** Facebook SDK ******************************************************
var firebase = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
var FBwhat = [] //These are used for grabbing 
var FBYelpwhat; 
var what = []//facebook 'likes' and running 
var where = []
var FBresponse; //an initial yelp search 



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

				document.getElementById('status').innerHTML = 'Please log ' +
					'into Facebook.';
			}
		}

		FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					var accessToken = response.authResponse.accessToken;
		} 
			statusChangeCallback(response);
		});

	
	}; //close window.fbAsyncInit

	

	// Load the SDK asynchronously 
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1518819868427496";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// FB Graph API
	function testAPI() {

				FB.api('/me','GET', {"fields":"id,name,email,likes,location"},function(response) {
					console.log('This is FB Graph API response: ', response);
					
					for (h=0;h<response.likes.data;h++){
						var userLikes = []
						 userLikes = response.likes.data[h].name
					}
					
					var facebookUserProfile = {
						userID: response.id,
						userName: response.name,
						userEmail: response.email,
						userLikes: userLikes,
						userLocation: response.location.name
					}


					firebase.push(facebookUserProfile)
				

				// 	for (i=0;i<20; i++){
				// 	what.push({[i]:response.likes.data[i].name});
				// 	where.push(response.location.name);
					

				// 		}
				// 	 var count = 0;
				// 				for (j=0;j<what.length;j++){
				// 						FBwhat = what[j][j];
				// 						FBwhere = where[0];
				// 						runYelpOnce();
				// 				}
				 
				// });
	}









//****************************************** Yelp ******************************************************       

function runYelpOnce() { //The function runs one time for every FB 'like'
						var auth = {

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

				var yelpOnceLimit = 1

				var accessor = {
					consumerSecret: auth.consumerSecret,
					tokenSecret: auth.accessTokenSecret
				};

				parameters = [];
				parameters.push(['term', FBwhat]);
				parameters.push(['location', FBwhere]);
				parameters.push(['callback', 'cb']);
				parameters.push(['oauth_consumer_key', auth.consumerKey]);
				parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
				parameters.push(['oauth_token', auth.accessToken]);
				parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
				parameters.push(['limit', yelpOnceLimit]);


				var message = {
					'action': 'https://api.yelp.com/v2/search',
					'method': 'GET',
					'parameters': parameters
				};

				OAuth.setTimestampAndNonce(message);
				OAuth.SignatureMethod.sign(message, accessor);

				var parameterMap = OAuth.getParameterMap(message.parameters);
				parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
				// console.log(parameterMap);

				var bestRestaurant = "Some random restaurant";

				$.ajax({
					'url': message.action,
					'data': parameterMap,
					'cache': true,
					'dataType': 'jsonp',
					'jsonpCallback': 'cb',
					'success': function(data, textStats, XMLHttpRequest) {
						// console.log(data);


				var i;

				for(i=0; i<=1; i= i+1){

										$("#FB_likes").append("<tr class='likesRow'>"   +   '<td>'+'<a href = '+data.businesses[i].url+"</a>"+'</td>'   +   '<td>'+'<a>'+data.businesses[i].name +'</a>'+'</td>'+  '</tr>')
										$("#likesRow").append('<tr>'   +   '<td>'+'<img src='+ data.businesses[i].rating_img_url+'>'+'</td>'   +   '<td>'+'<img src='+data.businesses[i].image_url+'>'+'</td>'+'</tr>');
										$("#likesRow").append('<td>').attr('value','Phone: ').attr('value', data.businesses[i].phone);
										$("#likesRow").append("<td>").attr('value', 'Yelp Reviews: ').attr('value', data.businesses[i].review_count); 
										$("#likesRow").append("<br />"); 
					 
										

					 }

					}
				})


		};



//************************************************************************************************************************************

function runYelp() {

		

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


};

$('#submit').on('click', function(){

		what = $('#what').val()
		where = $('#where').val()
		runYelp()

});



