

var ui = {
    /**
     @function sync the UI with the news in the story Cache
     */
    update :function (){
        storyCache.get(function(news){
            news.forEach(function (value){
                var des = $('<div/>').attr('class','description').html(value.description);
                var story =  $('<div/>', {
                    class: 'story'
                });
                
                des.appendTo(story);
                story.appendTo($('#container'));
            });
        });
    }
}