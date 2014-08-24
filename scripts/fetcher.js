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
            //country = "br";// testing
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

                    rss.read = false;
                    
                    var el = $(this);
                    titleSource = el.find("title").text().split(" - ");;
                    //rss.title = el.find("title").text();

                    rss.title = titleSource[0];
                    rss.sourceName = titleSource[1];



                    var desc = el.find("description").text();
                    desc = desc.replace('src="//','src="http://');

                    var anImage = function(element){
                        return (element.substring(1,5) == "http");
                    };


                    /*var image = desc.split("<img src=");

                    var imageList = image.filter(anImage);
                    if(imageList[0]){
                        image = imageList[0].split(" ");
                        image = image[0].replace('\"','');
                        image = image.replace('\"','');  
                        //rss.image = temp;

                        $.get(image, function (img) {
                           rss.image = img;

                        });
                    }else{
                        rss.image = null;
                    }
                    */
                    rss.image = null; //until further notice

                    desc = desc.replace('src="//','src="http://');
                    desc = desc.replace(/&nbsp;...*/,"... (Read more)</font></td></tr></table>");

                    rss.description = desc;  //this is not used anymore, but may be later

                    rss.category = el.find("category").text();
                    var pubDate = el.find("pubDate").text();
                    rss.ts = fetcher.convertDate(pubDate);

                    rss.story = null;
                    rss.link = el.find("link").text();


                    var storyCleaner = function (story, callback){

                        //console.log("before: " + story);
                        var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
                        var match;
                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }

                        re = /<ul\b[^>]*>([\s\S]*?)<\/ul>/gm;
                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }


                        re = /<li\b[^>]*>([\s\S]*?)<\/li>/gm;
                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }

                        re = /<link\b[^>]*>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }

                        re = /<a href\b[^>]*>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }

                        re = /<a class\b[^>]*>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }


                        re = /<meta\b[^>]*>/gm;
                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }

                        re = /<img\b[^>]*>/gm;
                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }              
                        re = /<div[^>]*search[^>]*>([\s\S]*?)<\/div>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }              

                        re = /<style[^>]*>([\s\S]*?)<\/style>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        }              

                        //This tag breaks the back button

                        re = /<base[^>]*>/gm;

                        while (match = re.exec(story)) {
                            story = story.replace(re,'');
                        } 

                        callback(story);


                    };



                    $.get(rss.link, function (story) {

                        storyCleaner(story, function (cleanedStory){

                            rss.story = cleanedStory;
                            if(rss.story !== null || rss.story !== '')
                               storyCache.storeStory(rss);   

                            //Remove excess stories
                            storyCache.clean(function(){});

                        });
                    });

                });

                callback();
            });
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

//storyCache.empty();