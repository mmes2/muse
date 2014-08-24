Muse
======================

Portland State University Capstone Team D, 2014.  Muse News Reader for the 
Firefox OS

TODO:
-----
  Finish this document
  
  Fix formatting on this document

  Clean up manifest
  
  Find more types of expressions to parse out of saved news stories
  
  Get realistic collection data to build better analysis algorithms
  
  Implement location based analysis algorithms
  
  Consult current vs expected network conditions when assigning collection times



Known Issues:
-------------
Some news sources, like the New York Times, do not display a news story when
clicked, but a "Sign up to read" type message. Possible solution: Add a way for
users to flag sources to blacklist

The parsing done to remove unneeded sections of news stories works most of the
time, but occasionally those filters will delete the story contents. Figure out
what sources it happens to and figure out why.

fetcher.js
---------------------
  This file could really use some refactoring! It's kind of just one big 
  function.

  The fetcher fetches news stories from the users localized version of Google 
  news, then saves those stories in the storyCache for later use. 

  fetchNews: function (num, callback)
  
    'num' is the number of news stories to fetch
    'callback' on completion 
    fetchNews will store the news story in a javascript object with the 
    following proprieties:

      read: Boolean
      title: The headline of the story
      sourceName: Where the story came from
      description: Currently unused, but holds interesting data
      image: currently turned off, image url taken from description
      category: Always 'Top Stories' on current configuration - room for growth! 
      link: Link to source, used to get story
      story: A string representing the news story. Through parsing with regular 
      expressions the source articles html file, we eliminate a lot of the noise 
      surrounding the body of the story. This will never be perfect and can 
      always be better!!

  convertDate: function(str)
  
    Handy tool to convert a news stories published data into a time in seconds, 
    which is also a unique database key where the story can be kept

fetcherAnalysis.js
---------------------
  A more specialized version of networkAnalysis' 'analyzer' and 'nextBestDate' 
  functions.


....


genFakeMonth.js
---------------------
  Used for generating a fake month worth of collection data in the network
  database for developing analysis algorithms and testing the timed fetch 
  capabilities of the fetcher through services.
 
networkAnalysis.js
---------------------
 -Randal
 
 
networkDatabase.js
---------------------
 -Randal

networkDataCollector.js
---------------------
 -The network data collector is started through the activate function, which 
  takes an integer as an argument. The argument represents a priority level the
  module should run at. They are defined as:

  1: 12 collections an hour
  
  2:  6 collections an hour 
  
  3:  4 collections an hour
  
  4:  2 collections an hour
  
  5+:  1 collection  an hour

  For instance, on priority level 3, a collection will run at 2:00, 2:15, 2:30,
  and so on until terminated. That time, combined with the day of the week form
  the key to the network database. This way, if we have a collection on 
  Wednesday at 2:15, it will be stored with the previous weeks collections on
  Wednesday at 2:15. This makes it easy for analysis to compare and average 
  data.

  The network data collector stores the following object in the database:

  { 
  
    "Start": Time collection started,
    
    "End": Time collection ended,
    
    "Latitude": String,
    
    "Longitude": String,
    
    "Wifi":{
    
               "Connected": Bool,
               
               "NetworkName": String, 
               
               "Bandwidth": Integer, measured in Mb/s, 
               
               "SignalStrength": Integer, relative 0-100%,
               
               "DataReceived": Integer, measured in b/s,
               
               "DataSent": Integer, measured in b/s 
               
           },
           
    "Mobile":{
    
               "Connected": Bool,
               
               "NetworkName": String,
               
               "Bandwidth": Integer, measured in Mb/s,
               
               "SignalStrength": Integer, relative 0-100%,
               
               "DataReceived": Integer, measured in b/s, 
               
               "DataSent": Integer, measured in b/s,
               
               "Roaming": Bool,
               
               "Metered": Bool (Currently always true, no reliable way to tell)
             
             }
  
  }
  
  The network data collector depends on the following WebAPIs:

  navigator.mozNetworkStats,
  
  navigator.mozWifiManager,
  
  navigator.mozMobileConnections,
  
  navigator.geolocation

  If any of these APIs change their interface, code in this module will need
  to be updated.
 
services.js
  
  Services sets the flow of control for the application. It starts the data 
  collector through the activate function, initializes network analysis through
  the init function, and is the only place the update function in ui should be 
  run. 


  Services will do these initializations, then ask analysis for the next best
  time today a batch fetch might be successful. If such a date exists, services
  will set an alarm through mozAlarms, which when triggered, will run the 
  fetchStories function in the fetcher. On completion, services will get the
  next best fetch time for the day and repeat the process. If no more fetch 
  times are available for today, services will give control to tryTomorrow, who
  will wait until tomorrow to restart services through the start function.
 
storyCache.js
---------------------
  The storyCache stores and serves news stories. It consists of the following 
  public functions:
 
  storeStory: function (news, callback)
  'news' is the story needed to be stored in the storyCache
  'callback' is called when complete

  getStory: function (id, callback)
  Given a story id (also the key in the database it's stored), getStory will 
  call callback(value) where 'value' is the value represented by story id. 

  getStoryIds: function (callback)
  Returns (through callback) all story ids stored in the cache

  markAsRead: function(storyId)
  Mark the story stored at key 'storyId' as read

  empty: function (callback)
  Clears cache of all news stories

  clean: function(callback)
  If story cache is storing over 100 stories, remove the oldest


 
tryTomorrow.js
---------------------
  Needed for services.js. When no more fetch times are available today, services
  runs tryTomorrow.activate(), which sets an alarm for the next 12:05am, at
  which point it calls services.start()

  This needs to be another file outside of services because we need different 
  actions when mozSetMessageHandler is triggered. 
 
ui.js
---------------------
 ......
 
 