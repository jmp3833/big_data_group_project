var GithubApi = require('github');

var github = new GithubApi({
  version: "3.0.0",
  debug: true,
  protocol: "https",
  timeout: 5000,
  headers: {
    "user-agent": "XXXX" 
  }
});

github.authenticate({
    type: "basic",
    username: "XXXX",
    password: "XXXX"
});

function queryRepos(query, callback) {
  github.search.repos(query, callback);
}

function queryIssuesByRepo(query, callback) {
  github.search.issues(query, callback);
}

module.exports = {
  queryRepos: queryRepos,
  queryIssuesByRepo: queryIssuesByRepo
};
