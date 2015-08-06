/*
 * Setup Twitter miner to connect to MongoDB and
 * mine tweets based on importes search criterion.
 */

var TwitterMiner = require('./app/twitter_store');

var searchParams = require('./data/terms.json');
searchParams = searchParams.join(',');
var mongoURL = 'mongodb://127.0.0.1:27017/test';

var criterion = {track: searchParams, language: 'en'}

TwitterMiner.streamTweets(mongoURL, criterion);
