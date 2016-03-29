



//****************************************** Facebook SDK ******************************************************
var firebaseValueCheck = new Firebase("https://sizzling-heat-1076.firebaseio.com/");
var FBwhat = [] 
var FBwhere = [] 
var FBYelpwhat; 
var what = []
var where = []
var FBresponse; 
var fbAllFriendsList;
var allFriends = [];
var fbPaging;
var facebookUserProfile = {}

	$('#yelpSearches').hide();



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
	var userLikes = []
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
					
						newFirebaseUser.set(facebookUserProfile); 	

					});



					

					facebookUserProfile = { 
						userName: response.name,
						userID: response.id,
						userEmail: response.email,
						userFriends: {},
						userLikes: {}
					}



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


				}); //end Graph api
				
				// FBwhere = where[0]; //this is a runYelpOnce() var

				// 	if (userLikes.length > 0) { 
				// 		for (k=0;k<what.length;k++) {
				// 			FBwhat = userLikes[k] //this is a runYelpOnce() var
				// 			runYelpOnce()
				// 		}

				// 	}





	}	

					
		
					
					
	

//***************** update firebase *********************************************************
		












//****************************************** Yelp ******************************************************       

function runYelpOnce() { //The function runs one time for every FB 'like'

	


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
				$('.panel-title').text('The best '+FBwhat+' spots in '+FBwhere+' are listed below').css('text-align', 'center');
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

} //end runYelpOnce *************************




//************************************************************************************************************************************

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
}         //end runYelp() *********************


$('#submit').on('click', function(){

		$('#searches').empty();
		what = $('#what').val()
		where = $('#where').val()
		$('#yelpSearches').show();
		runYelp()

});



