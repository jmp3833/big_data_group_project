var MongoClient = require('mongodb');
var mongoURL = 'mongodb://127.0.0.1:27017/test';
var sentiment = require('sentiment');
var fs = require('fs');
var rankings = require('./TermParser/languageRankings.json');

MongoClient.connect(mongoURL, function(err, db) {
  if(err) {throw err;}

  var ghCursor =  db.collection('github').find({});
  ghCursor.limit(10000);
  var soCursor =  db.collection('stackexchange').find({});
  soCursor.limit(10000);
  var twCursor =  db.collection('tweets').find({});
  twCursor.limit(10000);

  //Build up each issue in CSV format to pipe into rattle.
  var csvHeader = 'statement,sentiment,language,rating,source\n';
  var githubCSV = '';
  var twitterCSV = '';
  var stackexchangeCSV = '';

  ghCursor.toArray(function(err, documents) {
    if(err) {throw err;}
    documents.forEach(function(document) {
      githubCSV += buildCSVLine(document.body, document.language, 'github');
    });
    fs.writeFile('./github.csv', csvHeader + githubCSV, function(err) {
      if(err) {throw err;} 
    });
  });

  soCursor.toArray(function(err, documents) {
    if(err) {throw err;}
    documents.forEach(function(document) {
      stackexchangeCSV += buildCSVLine(document.title, document.language, 'stackexchange');
    });
    fs.writeFile('./stackexchange.csv', csvHeader + stackexchangeCSV, function(err) {
      if(err) {throw err;} 
    });
  });

  twCursor.toArray(function(err, documents) {
    if(err) {throw err;}
    documents.forEach(function(document) {
      twitterCSV += buildCSVLine(document.text, document.language, 'twitter');
    });
    fs.writeFile('./twitter.csv', csvHeader + twitterCSV, function(err) {
      if(err) {throw err;} 
    });
  });

});

function buildCSVLine(document, language, source) {
  //Strip newlines and special characters
  var textContent = document.replace(/\r?\n|\r/g, ' ').replace(/[^\w\s]/gi, '');
  var r = sentiment(textContent);
  var ranking = rankings[document.language]? rankings[document.language] : 18;

  return textContent + ',' + r.comparative + ',' + language + ',' + ranking + ',' + source + '\n';
}
