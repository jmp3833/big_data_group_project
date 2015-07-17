/*
 * Grab tweets with given keywords and store in a local MongoDB instance.
 * @author: Justin Peterson
 * @date: 07/01/15
*/

//Twitter API abstraction for NodeJS
var Twit = require('twit');
var MongoClient = require('mongodb').MongoClient;

/*
 * Utility Function to detect if a tweet is a retweet
 * in order to reduce redundancies and not write it to the DB
 * @tweetText: <String> text content of a tweet
 */
function isRetweet(tweetText) {
  //All retweets begin with 'RT @'
  return tweetText.indexOf("RT @") > -1;
}

//Any strings you would like to filter the Tweets by.
var searchParams = require('./terms.json');
searchParams = searchParams.join(',');
console.log(searchParams);

var twitterAPI = new Twit({
  //These are specific to the application
  consumer_key: 'qCi8ZXdOYutLp5zzXOEmgBO6X', 
  consumer_secret: '9CQfMVqpo5TPibMW18CM2P2OuVGcqvB6hBlGShPREBRSEOtrzF',

  //These are specific to your Twitter account
  access_token: '778969536-VLEwtOiWcMlbN4a1sPkG2XMKfvBqGLsF9NndpLSX', 
  access_token_secret: 'x6bJmx0efmBdSPnL35o6e6hi0emYpo3QNQ9QhGZKvMs9d' 
});

//TODO: Abstract out MongoDB connection code to its own module
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(dbConnectionErr, db) {
  if(dbConnectionErr) throw dbConnectionErr;
  //Filter all tweets with search key 'programming'
  var stream = twitterAPI.stream('statuses/filter', { track: searchParams, language: 'en' });
  stream.on('tweet', function (tweet) {
    db.createCollection('tweets', function(collectionErr, collection) {
      if(collectionErr) throw collectionErr;

      if(!isRetweet(tweet.text)) {
        collection.insert(tweet, function(dbWriteErr, docs) {
          if(dbWriteErr) throw dbWriteErr;
          console.log("Inserted a Tweet to DB!!");
          console.log("Tweet text: ", tweet.text);
         });
      }
    });
  });
});

