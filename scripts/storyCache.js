var storyCache = {
    /**
     @function store the news into storyCache by appending it into the news database.
     Note that the news might contains duplicated and item and not in sorted order.
     So when being retrieve, the retrieve function MUST take care of these parts.
     @param { array of rss object} news   -  array containing rss object reprenting the rss news
     */
    store: function (news, callback){
        localforage.getItem("news", function(value){
            if (value === null)
                value = news;
            else
                value = value.concat(news);
            localforage.setItem("news",value,function(value){
                if (typeof (callback) =='function')
                    callback();
            });
        })
    },
    /**
     @function get the news from the storyCache in sorted order by pubdate.
     The function must sort the news according to pub-date and remove duplicating item.
     After all the hardword has been done, then overwrite then sorted news into the storyCache
     for efficiency.
     @param (function)callback( news) : function to execute with the news story from the story cache

     */
    get: function (callback){
        localforage.getItem("news", function(value){
            var news;
            //if the storyCache if empty
            if (value === null)
            {
                news = value ;

                callback(news);
            }
            //otherwise, sort the news, execute callback and store the result back to storyCache
            else{
                if (!(value  instanceof Array))
                    throw "storyCache doesn't return array"
                news = value;
                news.sort(storyCache.compare);
                var tmp = [];
                var length = news.length;
                for (var i = 0; i <length -1; i++)
                {
                    if (value[i].ts != value[i+1].ts)
                        tmp.push(value[i]);
                }
                if (value[length -1].ts != tmp[tmp.length -1].ts )
                    tmp.push( value[length-1]);
                news = tmp;
                if (typeof(callback)==='function')
                    callback(news);
                //store the sorted array back to storyCache
                storyCache.overwrite(news);
            }
        })
    },
    /**
     * HELPER FUNCTIONS
     */
    /**
     @function empty the storyCache
     */
    empty: function (callback){
        localforage.removeItem('news',function(){
            console.log("cleared storyCache");
            if (typeof(callback)==='function')
                callback();
        });
    },
    /**
     @function overwrite the sorted news back to storyCache by overwrite the old one.
     */
    overwrite: function (news){
        localforage.removeItem('news',function(){
            localforage.setItem("news",news,function(value){
                console.log(value);
            });
        });
    },

    /**
     *  @function sort news object based on pub date
     */
    compare: function(a,b) {
        return b.ts - a.ts;
    }
}