Muse
======================

Portland State University Capstone Team D, 2014.  Muse News Reader for the 
Firefox OS

The Muse news reader is intended for use in developing countries where access
to a stable Internet is a challenge. It tracks the users history of a stable 
Internet connection and schedules batch fetches of news stories when it believes 
a stable connection will be available. 

Even away from an Internet connection, users are displayed a list of news 
stories, and can read their full contents. The user can visually see what stories
have been read by their light gray color on the story chooser screen.

Pictures and links are stripped from every news story to allow for easier 
off-line viewing. Up to 100 of the latest news stories will be stored on the 
phone, although this number may be a lot less. Each time a batch fetch is 
executed, it will retrieve 20 of the latest stories. Due to a currently unknown 
issue, some stories may be fetched more than once, limiting the number of news 
stories fetched during that cycle. 

The user interface is equipped with a refresh button, which will check if conditions
are suitable for a batch fetch of news stories, and activate the fetcher if they
are. A message will be displayed to the user letting them know if their pressing
of the refresh button resulted in new stories being loaded, or a decision that
now is not a good time to try and fetch stories. 


TODO:
-----
  Finish this document
  
  Fix formatting on this document

  Clean up manifest - A lot has been removed, more may need to be. Add descriptions to each permission
  
  Find more types of expressions to parse out of saved news stories
  
  Get realistic collection data to build better analysis algorithms
  
  Implement location based analysis algorithms
  
  Consult current vs expected network conditions when assigning collection times

  Refactor fetcher, it has grown too large

  Eliminate hackyness of user interface. It coulad probably be one html file if
  done correctly. Loading scripts just to call functions as a way to live without
  the script tag seems wrong.

  Some news stories come up blank, fix this
  
  Every news story should not be listed on the screen at once. It's making the interface slow, especially
  on initial launch. About 10 should be loaded from cache, and if the user gets to the bottom of the screen, 10 more
  should be loaded

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
 Overview:

The network analysis module analyses the network statistics contained in the netStatsDB data base and predicts when the next best time to connect to a network is likely to be. Since during the development of this module we did not have access to a good data set and had to create fake data, the current default analyser is merely a place holder.  

The code base provides a framework and interface for experimenting with different data analysis algorithms. The "analyzer" object can be replace at any time with a new one with a couple lines of code and a new analysis can be run. i.e. 

  netStats.analyzer = myAnalyzer;

  netStats.nextBestDate = myAnalyzer.nextBestDate;

See "../test/netAnlysisTest.js" for example code of how to interface with the netStats object. 
    

To Do:

Replace the default analyzer with something better, possibly fetcherAnalysis.js.

  
networkDatabase.js
---------------------
Overview:
The network data base module provides data storage for the networkDataCollector.js module and an interface for interacting with the data base. All data is stored in a single hierarchical JavaScript object. This object is stored in memory when the netStats.open() method is called. Calling netStats.save() or netStats.close() will store the current set of data to permanent memory using localforage.

The data base is unusual in that it consists of queues. Each entry contains multiple data samples that were collected across multiple weeks. A key for an entry is derived from the day of the week - Sun, Mon, Tues, etc. - and the data collection time. i.e. key = "Monday 12:45". If one runs the collector for a month then there will be four entries for each key. The queue size defaults to four and can be changed by calling setQueueSize(). If the collector is run for a fith week then the first entry will be tossed. 

For an example of the data structure for each record see genFakeMonth.js. Search for 'var add'. It should be around line 70. 

Working:

The interface is currently limited. There is netStats.addRecord() for adding records and netStats.getRecordsDay(day) for getting an array of records for the day, where day = new Date().getDay().

To Do:

It may be helpful to add methods for performing operations on the data such as min, max, select, sort, orderBy, etc.


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
 
 