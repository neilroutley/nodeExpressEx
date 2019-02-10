/*
 * main.js
 * 
 * controls all loading and unloading of tweets from index.html for tweetSearch
 * and also control the search bar functionality.
 * 
 * @auth Neil Routley
 * @date Feb 9, 2019
 */
var request = new XMLHttpRequest();

// main content div with id of root
var content = document.getElementById("root");

// gives the search bar the ability to use the  return/enter key to submit
var input = document.getElementById("search");
input.addEventListener("keyup", function(event){
	if (event.keyCode === 13){
		document.getElementById("searchButton").click();
	}
});

// this will display the appropriate tweets to the index.html for viewing
function searchTweets(){
	// clear all of the tweets
	var parent = document.getElementById("root");
	while (parent.firstChild) {
	    parent.firstChild.remove();
	}

	// build our get request for the proper tweets
	var getRequest = "/api";
	var searchText = document.getElementById("search").value;
	if (searchText.length > 0 ){
		getRequest = getRequest + "?q=" + searchText;
	}

	// access the api with our getRequest
	request.open('GET', getRequest, true);
	request.onload = function () {
	  // Begin accessing JSON data here
	  var data = JSON.parse(this.response);

	  if (request.status >= 200 && request.status < 400) {
	  	// for each tweet we need to create the html and place
	  	// all the data in the proper places
	    data.forEach(tweet => {

	    	var currentTweets = document.createElement("div");
			currentTweets.setAttribute("class", "col-md-6 col-xs-12");
			content.appendChild(currentTweets);

			var tweetDiv = document.createElement("div");
			tweetDiv.setAttribute("class", "tweet");
			currentTweets.appendChild(tweetDiv);

			var user = document.createElement("div");
			user.setAttribute("class", "user");
			tweetDiv.appendChild(user);

			var img = document.createElement("img");
			img.src = tweet.user.profile_image_url_https;
			user.appendChild(img);

			var userName = document.createElement("div");
			userName.setAttribute("class", "user-name");
			userName.textContent = tweet.user.screen_name;
			user.appendChild(userName);

			var date = document.createElement("div");
			date.setAttribute("class", "date");
			date.textContent = tweet.created_at;
			user.appendChild(date);

			var text = document.createElement("div");
			text.setAttribute("class", "text");
			text.textContent = tweet.text;
			tweetDiv.appendChild(text);
	    });	
	  } else {
	    	console.log('error');
	  }
	}

	request.send();
}

// first add all of the tweets on page load
searchTweets();
