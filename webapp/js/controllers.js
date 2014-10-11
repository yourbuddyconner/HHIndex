angular.module("HHIndex.controllers", ['firebase'])
//Controllers
.controller("PostsCtrl", function($scope, $firebase, $rootScope, Posts) {
  // download the data into a local object
  $scope.posts = Posts.getPosts();
  // $scope.posts_formatted = {};
  // $scope.posts.forEach(function(post){
  //   post.message = encode4HTML(post.message);
  //   posts_formatted.push(post);
  // });
})

.controller("PostCtrl", function($scope, $stateParams, $firebase, $sce){
  post_url = "https://hhindex.firebaseio.com/posts/" + $stateParams.postID;

  var ref = new Firebase(post_url);
  var sync = $firebase(ref);

  $scope.post = sync.$asObject();
});