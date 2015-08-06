/*
 * Grab tweets with given keywords and store in a local MongoDB instance.
 * @author: Justin Peterson
 * @date: 07/15/15
 */

//Twitter API abstraction for NodeJS
var Twit = require('twit');
var MongoClient = require('mongodb').MongoClient;

/*
 * Utility Function to detect if a tweet is a retweet
 * in order to reduce redundancies and not write it to the DB
 * @tweetText: <String> text content of a tweet
 */
function _isRetweet(tweetText) {
  //All retweets begin with 'RT @'
  return tweetText.indexOf("RT @") > -1;
}

function _connectToDB(url, callback) {
  MongoClient.connect(url, function(dbConnectionErr, db) {
    callback(dbConnectionErr, db);
  });
}

function _connectToTwitterAPI() {
  var twitterAPI = new Twit({
    //These are specific to the application
    consumer_key: 'xxxx', 
    consumer_secret: 'xxxx',

    //These are specific to your Twitter account
    access_token: 'xxxx', 
    access_token_secret: 'xxxx' 
  });

  return twitterAPI;
}

function streamTweets(dbURL, criterion) {
  var DB = _connectToDB(dbURL, function(dbConnectionErr, db) {
    var twitterAPI = _connectToTwitterAPI();

    var stream = twitterAPI.stream('statuses/filter', criterion );
    stream.on('tweet', function (tweet) {
      if(!_isRetweet(tweet.text)) {
        db.collection('tweets').insertOne(tweet, function(collectionErr, collection) {
          if(collectionErr) throw collectionErr;
          console.log("Inserted a Tweet to DB!!");
          console.log("Tweet text: ", tweet.text);
        });
      }
    });
  });
}

module.exports = {
  streamTweets: streamTweets
}
