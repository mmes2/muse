

var ui = (function() { 

    var Ui = {};  
    /**
     @function sync the UI with the news in the story Cache
     */
    Ui.update = function (){
        storyCache.getStoryIds(function (keys) {
            
            var sortedKeys = keys.sort(function(a,b) {return b-a;});
            
            sortedKeys.forEach(function (key){

                storyCache.getStory(key, function(value){
                 
                    var linkString = "storyDisplay.html?" + value.ts;
                 
                    //var blob = new Blob([value.image]);
                    //var imageURI = window.URL.createObjectURL(blob);
                    
                    //var img = document.createElement("img");
                    //img.src = window.URL.createObjectURL(blob);
                    
                    var des = $('<div/>').attr('class','description').html(
                        "<ul><li><a href=" + linkString + ">" + 
                        "<h2 id=title>" + value.title  + "</h2><h2 id=source>"  + 
                        value.sourceName + "</h2></a></li></ul>");

                    if(value.read){
                        isRead = "readStory";
                    }else{
                        isRead = "unreadStory";
                    }
                    
                    var story =  $('<div/>', {
                        class: isRead,
                        description:value.ts,
                    });
                    
                    des.appendTo(story);
                    
                    story.appendTo($('#container'));
                    
                });
            });
        });
    };
       
    return Ui;


}());