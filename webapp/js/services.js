angular.module("HHIndex.services", ['firebase'])

.factory('Posts', function($firebase){
  var ref = new Firebase("https://hhindex.firebaseio.com/posts/");
  sync = $firebase(ref);
  posts = sync.$asObject();

  return {
        getPosts: function(){
      return posts;
    }
  };
//     search: function(string){
//       var index = lunr(function () {
//         this.field('id');
//         this.field('message');
//         this.field('comments');
//         this.field()
//       });
// //finish this part... lol
//       posts.forEach(function(post){
//         index.add(post.id);
//         index.add(post.message);
//         index.add(post.comment)
//       });

//       results = index.search(string);
//       refs = [];
//       results.forEach(function(result){
//         refs.append(lunr.Store.get(result.ref));
//       });
//       matched=[];
//       refs.forEach(function(ref){
//       if(posts[ref.title]){
//           matched.append(posts[ref.title]);
//         }
//       });
//     },
});