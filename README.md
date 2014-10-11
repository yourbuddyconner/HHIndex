#Hackathon Hackers Index
HHIndex is a webapp created in AngularJS that reads the feed from <pre>https://www.facebook.com/groups/hackathonhackers/</pre> and reformats it so it is searchable and more user-friendly for people who want to find older posts.

##Where is it?
The app is live at <pre>https://hhindex.firebaseapp.com</pre> right now!

##Dude, this sucks, what are you doing?
Chill, it's not done yet. 

##TODO:
- Webapp
    - Move UI to a flexgrid    
        - Text Post -> 2x3 (Maybe 2x4 or 4x2 if it's really long)
        - Image Post -> 2x2
    - Users
        - Add users
        - Login from exernal site (facebook?)
        - Subscribe to groups
    - Search functionality (Lunr.js or something)
    - "Is it a shitpost?" -- look for bad commenters/comments ratio, display it?
    - Link to original post  
    - Subgroups
        - Color-Coded
- Python 
    - Don't make any more API calls directly, use [MarkSweep](https://github.com/jxnl/fbmarkandsweep/tree/facebookdao) instead
    - Crawl multiple times daily
    - Identify new comments and push them to Firebase