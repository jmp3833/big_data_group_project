var MongoClient = require('mongodb');
var mongoURL = 'mongodb://127.0.0.1:27017/test';
var sentiment = require('sentiment');
var fs = require('fs');

MongoClient.connect(mongoURL, function(err, db) {
  if(err) {throw err;}
  var ghCursor =  db.collection('github').find({});
  ghCursor.limit(10000);
  
  //Build up each issue in CSV format to pipe into rattle.
  var githubCSV = 'statement,sentiment,language,rating,source\n';

  ghCursor.toArray(function(err, documents) {
    documents.forEach(function(document) {

      //Strip newlines and special characters
      var textContent = document.body.replace(/\r?\n|\r/g, ' ').replace(/[^\w\s]/gi, '');
      var r = sentiment(textContent);

      console.log(r.comparative);
      githubCSV += (textContent + ',' + 'r.comparative' + ',' + 'javascript' + ',' + '2' + ',' + 'github' + '\n');
    });
    fs.writeFile('./output.csv', githubCSV, function(err) {
      if(err) {throw err;} 
    });
    db.close();
  });
});
