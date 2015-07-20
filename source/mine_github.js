var GitHub = require('./app/github_store');

var query = {
  language: "javascript",
  q: "React"
};

GitHub.queryRepos(query, function(err, results) {
  console.log(JSON.stringify(results));
});
