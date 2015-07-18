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

github.search.repos({
  language: "javascript",
  q: "React"
}, function(err, res) {
    console.log(JSON.stringify(res));
});
