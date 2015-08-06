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

github.authenticate({
    type: "basic",
    username: "jmp3833",
    password: "JmP71393"
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
