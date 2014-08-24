var storyCache = {
    /**
     @function store the news into storyCache by appending it into the news database.
     Note that the news might contains duplicated and item and not in sorted order.
     So when being retrieve, the retrieve function MUST take care of these parts.
     @param { array of rss object} news   -  array containing rss object reprenting the rss news
     */


    storeStory: function (news, callback){
        localforage.setItem(news.ts,news,function(value){
            if (typeof (callback) =='function')
                callback();
        });
    },
    /**
     @function get the news from the storyCache in sorted order by pubdate.
     The function must sort the news according to pub-date and remove duplicating item.
     After all the hardword has been done, then overwrite then sorted news into the storyCache
     for efficiency.
     @param (function)callback( news) : function to execute with the news story from the story cache

     */
    getStory: function (id, callback){


        localforage.getItem(id, function(value){

            callback(value);        

        });
    },
    getStoryIds: function (callback){

        localforage.keys(function(keys) {            
            callback(keys.filter(notStory));   
        });

        var notStory = function (element){

            /*This is a terrible hack. Both news stories 
              and collection intervals seem to be stored 
              in the same localforage database
              TODO: Fix this!
            */
            if(element > 1400000000)  
                return true;          
            else                      
                return false;
        };

    },

    markAsRead: function(storyId){
      localforage.getItem(storyId, function(value){
         value.read = true;
          localforage.setItem(value.ts, value, function(){});          
      });
        
    },
    
    /**
     * HELPER FUNCTIONS
     */
    /**
     @function empty the storyCache
     */
    empty: function (callback){
        storyCache.getStoryTimes(function (keys){
            keys.forEach(function (key){
                localforage.removeItem(key, function(){}); 
            });
            console.log("cleared storyCache");
            if (typeof (callback) =='function')
                callback();
        });


    },
    //Maintain 100 news stories
    clean: function(callback){
        storyCache.getStoryIds(function (keys){

            keys = keys.sort(function(a,b) {return b-a;});
            
            if(keys.length > 100){
             
                keys = keys.slice(0,100);
                keys.forEach(function (key) {
                    console.log("removed story");
                    localforage.removeItem(key, function(){}); 
                });
            }
            
            if (typeof (callback) =='function')
                callback();

        });

    },
    compare: function(a,b) {
        return b.ts - a.ts;
    }
}