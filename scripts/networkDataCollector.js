//header coming soon!

//uncomment this if you want to clear database on next launch. THIS MIGHT INTERFERE WITH storyCache!!
//localforage.clear(function(){});

//This is commented out when committing to github. Should be activated in ui.js when going live
//activate(3);

//activate: When called, set alarms to call collectNetworkStats() at provided interval
//Should be called in ui.js when ready for deployment. Only useful when actually 
//running on a phone. Most APIs will not be available in an emulator
function activate(PriorityLevel) {

  var oneMinute = 60000; // ms
  if(PriorityLevel==1) { rate = 300000; minutes = 5; } //5 minutes
  else if(PriorityLevel==2) { rate = 600000; minutes = 10; } //10 minutes
  else if(PriorityLevel==3) { rate = 900000; minutes = 15; } //15 minutes
  else if(PriorityLevel==4) { rate = 1800000;  minutes = 30;} //30 minutes
  else { rate = 3600000;  minutes = 60;} //1 hour

  var d = new Date();
  var timeout = (minutes - d.getMinutes() % minutes) * oneMinute;
  d.setTime(d.getTime() +timeout); 

  var collectAlarm = navigator.mozAlarms.add(d, "ignoreTimezone");

  collectAlarm.onsuccess = function () {
  	console.log("alarm was scheduled for: " + d);
  };
 
  collectAlarm.onerror = function () {
  	console.log("Unable to schedule alarm: " + this.error.name);
  }
  navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
    console.log("Collection alarm fired at: " + d); 
    collectNetworkStats();
    d.setTime(d.getTime() + rate);
    collectAlarm = navigator.mozAlarms.add(d, "ignoreTimezone");
  });
}

//Collect network stats, send record to networkDatabase
//Currently: a hot mess
function collectNetworkStats(){ 
  var d = new Date();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var Interval = d.getDay() + " " + d.getHours() + ":" +  d.getMinutes();

  //mozWifiManager doesn't seem to work, even on the phone
  if(navigator.mozWifiManager){
    var wifi = navigator.mozWifiManager;
    var request = wifi.getNetworks();
    console.log("networks: " + request);
    var Name = request[0];
  }else {
    console.log("no mozWifiManager");
    var Name = null;
  }

  if(navigator.mozNetworkStats) {
    console.log("We have mozNetworkStats, you must be using an actual phone!");

//    var manageWifi   = navigator.mozNetworkStats.connectionTypes.indexOf('wifi')   > -1;
//    var manageMobile = navigator.mozNetworkStats.connectionTypes.indexOf('mobile') > -1;
    var ConnectionType = null;
  }else {
    console.log("no mozNetworkStats");
    var ConnectionType = null;
  }

  //this doesn't work
  if(navigator.mozNetworkStats) {
    var stats = navigator.mozNetworkStats;

    if(stats.MOBILE == 0){
      ConnectionType = "mobile";
    }else if(stats.WIFI == 0){
      ConnectionType = "wifi";
    }else{
      ConnectionType = "none";
    }
  }

  //no code on the next 3 data members
  var Metered = false;
  var Bandwidth = false;
  var SignalStrength = false; //wifi - WiFi Information API, mobile - Mobile Connection API


  //Getting data sent and received
  if(navigator.mozNetworkStats){
    var DataRecieved = 0;
    var DataSent = 0;

    // var networkInterfaces = navigator.mozNetworkStats.availableInterfaces;
    var config = {
      start: new Date(d.getTime() - (900000)),
      end: new Date()
    };


    var stats = navigator.mozNetworkStats;

    var sampleRate = stats.sampleRate;
    var request = stats.getAvailableNetworks();
  //  var network = request.result[0];

  //  console.log("wifi: " + network);
//    var request = mozNetworkStatsManager.getAvailableNetworks();


    request.onsuccess = function () {
      var total = {
        receive: 0,
        send   : 0
      };

      this.result.forEach(function (chunk) {
        DataRecieved += chunk.rxBytes;
        DataSent += chunk.txBytes;
      });

    console.log("Since: " + config.start.toString());
    console.log("Data received: " + (total.receive / 1000).toFixed(2) + "Kb");
    console.log("Data sent: " + (total.send / 1000).toFixed(2) + "Kb");


    } 

    request.onerror = function () {
      console.log("Something goes wrong: " + request.error);
    }

  }else{
    var DataRecieved = false; //navigator.mozNetworkStats
    var DataSent= false; //navigator.mozNetworkStats
  }

  //GPS part. This might give bad data if geolocation not allowed by user
  var Latitude = false;
  var Longitude = false;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      Latitude = position.coords.latitude;
      Longitude = position.coords.longitude;
    });
  }else { console.out("no geolocation") } 

  console.log("Collection Record:");
  console.log("Network Name: " + Name);
  console.log("Connection Type: " + ConnectionType);
  console.log("Metered: " +  Metered);
  console.log("Bandwidth: "+ Bandwidth);
  console.log("SignalStrength: " + SignalStrength);
  console.log("DataRecieved: "+ DataRecieved);
  console.log("DataSent: " + DataSent);
  console.log("Latitude: "+ Latitude);
  console.log("Longitude: " + Longitude);

  addRecord( 
  { "Interval":Interval, 
    "CollectionDate":d,
    "Name":Name, 
    "ConnectionType":ConnectionType, 
    "Metered":Metered,
    "Bandwidth":Bandwidth, 
    "SignalStrength":SignalStrength,
    "DataRecieved":DataRecieved,
    "DataSent":DataSent,
    "Latitude":Latitude,
    "Longitude":Longitude
  });
}
