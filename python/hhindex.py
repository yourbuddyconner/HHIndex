# README:
#   This script fetches the Hackathon Hackers group feed, parses each 
#   post for the relevant information, creates new post objects, and then 
#   relays those objects to Firebase for storage and use in the AngularJS
#   postion of this application. 
#
#   This script requires the following dependancies:
#       fbconsole: https://github.com/fbsamples/fbconsole
#       python-firebase: https://github.com/mikexstudios/python-firebase

import json
from datetime import datetime, timedelta
import fbconsole
import elasticsearch
import logging
logging.basicConfig(level=logging.INFO)


#from firebase import Firebase

#Firebase object
#f = Firebase('https://hhindex.firebaseio.com/posts')
es = elasticsearch.Elasticsearch([{'host': '162.252.243.7', 'port': 9200}])

#es = Elasticsearch(['162.252.243.7:9200'])
#Facebook object and config stuff 
facebook = fbconsole
facebook.APP_ID = '837894229583934'
facebook.authenticate()
group_id = "759985267390294"
group_path = "/" + group_id + "/feed"

#Time to search until
one_day_ago = datetime.utcnow() - timedelta(days=1)

# Fetch the ID's of the posts we already have
# firebase_posts = f.get_shallow({"shallow": "true"})
# if firebase_posts == None: 
#     firebase_posts = []

# es_posts = es.get(index="HH-Posts", doc_type="post")
# es_posts = es_posts["_source"]
posts = []

num_pages = 11
while num_pages > 0:
    # Fetch the first 25-ish items from the group feed
    feed = facebook.get(group_path) 
    # Iterate over the feed   
    for post in feed["data"]:
        # The time the post was last updated
        updated = datetime.strptime(post["updated_time"], "%Y-%m-%dT%H:%M:%S+%f")
        # Check if we have it and that it's within time bounds
        if updated > one_day_ago: 
            # Create a new post so we can get rid of any oAuth tokens that
            # are hanging around
            sanitizedPost = {}
            # Move simple stuff from post to the new post
            sanitizedPost['created_time'] = post['created_time']
            sanitizedPost['from'] = post['from']
            sanitizedPost['id'] = post['id']
            sanitizedPost['updated_time'] = post['updated_time']

            if 'message' in post:
                sanitizedPost['message'] = post['message']

            #fetch all the likes
            if 'likes' in post:
                sanitizedPost['likes'] = post['likes']['data']
                if 'next' in post['likes']['paging']:
                    likes = facebook.get("/" + post['id'] + '/likes', params={'limit': 500})
                    sanitizedPost['likes'] = likes['data']
                sanitizedPost['like_count'] = len(sanitizedPost['likes'])
            else:
                sanitizedPost['like_count'] = 0                

            #fetch all the comments
            if 'comments' in post:
                sanitizedPost['comments'] = post['comments']['data']
                if 'next' in post['comments']['paging']:
                    comments = facebook.get("/" + post['id'] + '/comments', params={'limit': 500})
                    sanitizedPost['comments'] = comments['data']
                sanitizedPost['comment_count'] = len(sanitizedPost['comments'])
            else:
                sanitizedPost['comment_count'] = 0

            print "New one: ", post["id"]
            # Wraps the post object in another object so it has a unique ID
            posts.append(sanitizedPost)
        #TODO:  Write another if-statement that will update pre-existing posts with new
        #       comments and likes. 
    # Handle pagination
    try: 
        next_page = feed["paging"]["next"]
        if next_page[31:] != group_path:
            group_path = next_page[31:]
        else:
            print "No more pages :("
            break
        print "Getting next page at: ", group_path
    except KeyError:
        break
    num_pages -= 1

# Relay all the new posts to Firebase for safekeeping
for post in posts:
    print "pushing to ElasticSearch"
    res = es.index(index="hh-posts", doc_type="post", id=post['id'], body=post, ignore=500)
    print res
    #f.patch(post)
print "Done"