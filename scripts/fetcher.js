$.ajaxSetup( {
    xhr: function() {
        return new window.XMLHttpRequest( {
            mozSystem: true
        } );
    }
} );
/**

 @param {int} num   - num of stories
 */
var fetcher = {
    /**
     * @function fetch the news conditionally based on the number of stories specified
     * @param num number news want to fetch in a single call
     * @param callback action to do after the news have been fetched
     */

    fetchNews: function (num, callback) {
        //query country code
        $.get("http://ipinfo.io/json", function (data) {
            var country = data.country;
            country = "br";// testing
            //translate country code to google news edition code
            //Unfortunately, there is no programmactical way to do this. So if have time,
            // I'll come back to cover all the country that Firefox phone targets
            //For now, just Brazil. "list of country code can be founded here"
            //https://support.google.com/news/answer/40237?topic=8851&hl=en
            switch(country.toLowerCase()) {
                case "br":
                    country = "pt-BR_br";
                    break;
                case "co":
                    country = "es_co";
                    break;
                case "mx":
                    country = "es_mx";
                    break;
                case "pl":
                    country = "pl_pl";
                    break;
                case "rs":
                    country = "sr_rs";
                    break;
                case "es":
                    country = "es";
                    break;
                case "ve":
                    country = "es_ve";
                    break;
                default:
                    country = "us"
            }
            //TODO: convert country code to google edition code
            //construct the URL
            url = "http://news.google.com/news/feeds?pz=2&cf=all&ned=" + country + "&output=rss&num=" + num;

            //get the stories from google news
            $.get(url, function (data) {
                var title = "";
                var news = []; //array of rss
                //parse the rss story and in the object
                $(data).find("item").each(function () { // or "item" or whatever suits your feed
                    var rss = {};
                    var el = $(this);
                    rss.title = el.find("title").text();
                    rss.link = el.find("link").text();
                    
                    var desc = el.find("description").text();
                    desc = desc.replace('src="//','src="http://');
                    desc = desc.replace(/&nbsp;...*/,"... (Read more)</font></td></tr></table>");
                    
                    rss.description = desc;
                    
                    rss.category = el.find("category").text();
                    var pubDate = el.find("pubDate").text();
                    rss.ts = fetcher.convertDate(pubDate);
                    news.push(rss);
                });
                //store the news
                storyCache.store(news,callback);
            })
        });
    },
    /**
     * HELPER FUNCTIONS
     */
    /**
     *  @function convert RSS pubdate to timestamp
     */
    convertDate: function(str){
        var date = new Date(str);
        var timestamp = Math.round(date.getTime()/1000);
        return timestamp;
    }
}
//fetcher.fetchNews(20);
//storyCache.get()
//storyCache.empty();