var app = angular.module("HHIndex", ["firebase", "ui.router"]);

//Controllers
app.controller("PostsCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://hhindex.firebaseio.com/posts");

  // create an AngularFire reference to the data
  var sync = $firebase(ref);

  // download the data into a local object
  $scope.posts = sync.$asObject();
  // $scope.posts_formatted = {};
  // $scope.posts.forEach(function(post){
  //   post.message = encode4HTML(post.message);
  //   posts_formatted.push(post);
  // });
});

app.controller("PostCtrl", function($scope, $stateParams, $firebase){
  post_url = "https://hhindex.firebaseio.com/posts/" + $stateParams.postID;

  var ref = new Firebase(post_url);
  var sync = $firebase(ref);

  $scope.post = sync.$asObject();
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/posts");
  $stateProvider
    .state('posts', {
      url: "/posts",
      templateUrl: "views/posts.html",
      controller: "PostsCtrl"
    })
    .state('post', {
      url: "/posts/:postID",
      templateUrl: "views/post.html",
      controller: "PostCtrl"
    });
});

function encode4HTML(str) {
  return str
    .replace(/\r\n?/g, '\n')
    // normalize newlines - I'm not sure how these
    // are parsed in PC's. In Mac's they're \n's
    .replace(/(^((?!\n)\s)+|((?!\n)\s)+$)/gm, '')
    // trim each line
    .replace(/(?!\n)\s+/g, ' ')
    // reduce multiple spaces to 2 (like in "a    b")
    .replace(/^\n+|\n+$/g, '')
    // trim the whole string
    .replace(/[<>&"']/g, function(a) {
      // replace these signs with encoded versions
      switch (a) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case '\'':
          return '&apos;';
      }
    })
    .replace(/\n{2,}/g, '</p><p>')
    // replace 2 or more consecutive empty lines with these
    .replace(/\n/g, '<br />')
    // replace single newline symbols with the <br /> entity
    .replace(/^(.+?)$/, '<p>$1</p>');
  // wrap all the string into <p> tags
  // if there's at least 1 non-empty character
}