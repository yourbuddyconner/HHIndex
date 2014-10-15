angular.module("HHIndex.controllers", ['firebase'])
//Controllers
.controller("PostsCtrl", function($scope, $firebase, $rootScope, Posts) {
  // download the data into a local object
  $scope.posts = Posts.getPosts();

  $scope.isLong = function(string){
    if(string){
      return string.length > 500;
    }
  };
})

.controller("PostCtrl", function($scope, $stateParams, $firebase, $sce){
  post_url = "https://hhindex.firebaseio.com/posts/" + $stateParams.postID;

  var ref = new Firebase(post_url);
  var sync = $firebase(ref);

  $scope.post = sync.$asObject();
});