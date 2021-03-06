/*
 * index.js
 * tweetSearch NodeJS Express server delivers tweets as JSON through this RESTapi
 * 
 * @auth Neil Routley
 * @date Feb 9, 2019
 */
var express = require("express");
var fs = require("fs");
var app = express();

app.use(express.static("public"));


// callback function to load all the tweets from the local json file
function loadTweets(callback) {
    fs.readFile("./tweets.json", "utf8", function(err, contents) {
        if (err) throw err;

        var tweets = JSON.parse(contents);

        callback(tweets);
    });
}


// main api get url that loads all the tweets if querying with no query string
// and returns as json
// to get only the tweets from specific users, query the api with ?q=user-name
// where the user-name is the users twitter user-name
// Note: now returns matches based on regex so you can short the name or just 
// use one letter to get all the users with that first letter
app.get("/api", function(req, res) {
    var user = req.query.q;
    loadTweets(function(tweets) {
        var regexCheck = new RegExp('^[a-zA-Z0-9-_]+$');
        if (user && regexCheck.test(user.toLowerCase())){
            var filtered = tweets.filter(function(item){
            var expression = "\\b" + user.toLowerCase() + ".*";
            var regex = new RegExp(expression);

            return regex.test(item.user.screen_name.toLowerCase());
                // return item.user.screen_name.toLowerCase() == user.toLowerCase();
            });
            console.log("I loaded " + filtered.length + " tweets");
            res.send(filtered);
        } else {
            console.log("I loaded " + tweets.length + " tweets");
            res.send(tweets);
        }
    });
    
});


// listener for express: using port 3000
app.listen(3000, function () {
    console.log("Server listing for connections on port 3000");
});