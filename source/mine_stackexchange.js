var stackexchange = require('stackexchange');
var MongoClient = require('mongodb');
var languages = require('./TermParser/languages.json');
var mongoURL = 'mongodb://127.0.0.1:27017/test'
var options = { version: 2.2 };
var context = new stackexchange(options);

languages.forEach(function(language) {

  var filter = {
    key: 'BKCTaQSgaXVNth*oR1ybgA((',
    pagesize: 100,
    tagged: language,
    sort: 'activity',
    order: 'asc'
  };

  context.questions.questions(filter, function(err, results){
    if (err) throw err;

    MongoClient.connect(mongoURL, function(err, db) {
      results.items.forEach(function(item) {
        item.language = language;
        db.collection('stackexchange').insertOne(item, function(insertErr, result) {
          return result;
        });
      }); 
      db.close();
    });
  });
});
