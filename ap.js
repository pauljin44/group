
    var type = 'Jaws';
    var queryURL = "http://www.omdbapi.com/?t=" +  + "&y=&plot=short&r=json";

    $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
    	console.log(response)

    	$('#title').html(response.Title);
    	$('#plot').html(response.Plot)
    	$('#image').attr("src", response.Poster);


    }); 
    //movie title
    //plot
    //image
