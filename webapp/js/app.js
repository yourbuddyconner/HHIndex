var app = angular.module("HHIndex", ["firebase", "ui.router", "HHIndex.services", "HHIndex.controllers"]);

//Services 
app.run(function($rootScope, $sce){
  //Utilities that every controller should be able to access
  $rootScope.HTMLify = function(string){
    if (string){
      string = string.trim();
      return $sce.trustAsHtml(string.length>0?'<p>'+string.replace(/[\r\n]+/,'</p><p>')+'</p>':null);
    }
  };
  $rootScope.linkify = function(string){
    if (string){
      return Autolinker.link(string);
    }
  };
  $rootScope.trunc = function(string, num){
    if(string){
        if (string.length > 180){
          return string.slice(0, num) + "...";
        }
        return string;
    }
  };
});

//App config
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