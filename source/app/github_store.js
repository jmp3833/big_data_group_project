var GithubApi = require('github');

var github = new GithubApi({
  version: "3.0.0",
  debug: true,
  protocol: "https",
  timeout: 5000,
  headers: {
    "user-agent": "jmp3833" 
  }
});

function queryRepos(query, callback) {
  github.search.repos(query, callback);
}

var query = {
  language: "javascript",
  q: "React"
};

queryRepos(query, function(err, results) {
  console.log(JSON.stringify(results));
});

module.exports = {
  queryRepos: queryRepos
};
