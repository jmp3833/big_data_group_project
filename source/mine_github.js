var GitHub = require('./app/github_store');

var query = {
  language: "javascript",
  q: "React"
};

GitHub.queryRepos(query, function(err, results) {
  if(err) {throw err;}

  var repos = parseRepoSetForURLs(results);

  repos.forEach(function(repo) {
  
    var issuesQuery = {
      q: {
        repo: repo 
      } 
    }

    GitHub.queryIssuesByRepo(issuesQuery, function(err, results) {
      results.items.forEach(function(issue) {
        console.log(issue.body);
      });
    });
  
  });
});

function parseRepoSetForURLs(jsonResponse) {
  var reposToSearch = [];
  jsonResponse.items.forEach(function(repository) {
    reposToSearch.push(repository.full_name);
  });

  return reposToSearch;
}
