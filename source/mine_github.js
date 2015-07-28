/*
 * Query for repos based on language type,
 * and find all issues tagged with associaced repos.
 * these will then be used with sentiment analysis.
 * @author: Justin Peterson
 */

var GitHub = require('./app/github_store');
var MongoClient = require('mongodb');
var mongoURL = 'mongodb://127.0.0.1:27017/test'

var query = {
  language: "javascript",
  q: "React"
};

function parseRepoSetForURLs(jsonResponse) {
  var reposToSearch = [];
  jsonResponse.items.forEach(function(repository) {
    reposToSearch.push(repository.full_name);
  });

  return reposToSearch;
}

GitHub.queryRepos(query, function(err, results) {
  if(err) {
    throw err; 
    process.exit(1);
  }

  var repos = parseRepoSetForURLs(results);

  repos.forEach(function(repo) {
  
    var issuesQuery = {
      q: {
        repo: repo 
      } 
    }

    GitHub.queryIssuesByRepo(issuesQuery, function(err, allIssues) {
      if(err){throw err}; 
      MongoClient.connect(mongoURL, function(err, db) {
        allIssues.items.forEach(function(issue) {
          db.collection('github').insertOne(issue, function(insertErr, result) {
            return result;
          });
        }); 
        db.close();
      });
    });
  });
});
