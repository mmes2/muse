
var displayStory = function (){

  timeStamp = window.location.search.replace("?", "");

  storyCache.getStory(parseInt(timeStamp), function(value){

    //for debugging story contents
    //console.log(value.story);     

    storyCache.markAsRead(parseInt(timeStamp));

    des = $('<div/>').attr('class','description').html(
      "<p>" + value.story  + "</a></p>");

    var story =  $('<div/>', {
      class: 'story',
    });


    des.appendTo(story);
    story.appendTo($('#newsStory'));



  });
};

displayStory();