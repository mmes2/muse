


  var ns1 = document.getElementById('ns1');
  var ns2 = document.getElementById('ns2');
  var ns3 = document.getElementById('ns3');
  var ns4 = document.getElementById('ns4');
  var cr1 = document.getElementById('cr1');
  var cr2 = document.getElementById('cr2');
  var cr3 = document.getElementById('cr3');
  var cr4 = document.getElementById('cr4');
  var cr5 = document.getElementById('cr5');
  var cr6 = document.getElementById('cr6');
  var cr7 = document.getElementById('cr7');
  var cr8 = document.getElementById('cr8');


function activate(PriorityLevel) {

  localforage.clear(function(){});
  var rate = 900000;  //calculated based on priority, this would be 3 (15 minutes)
  //navigator.mozNetworkStats.sampleRate = rate;  //chunk of time we want to record sent / recieved data

//var manageWifi   = navigator.mozNetworkStats.connectionTypes.indexOf('wifi')   > -1;
//var manageMobile = navigator.mozNetworkStats.connectionTypes.indexOf('mobile') > -1;
  //var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;


  if(navigator.mozNetworkStats){
  // var networkInterfaces = navigator.mozNetworkStats.availableInterfaces;
  // var config = {
  //   start: new Date(today.getTime() - (rate))
  //   end: new Date()
  // };

   var request = navigator.mozNetworkStats.find(config);

   request.onsuccess = function () {
    var total = {
      receive: 0,
      send   : 0
    };

    this.result.forEach(function (chunk) {
      total.receive += chunk.rxBytes;
      total.send    += chunk.txBytes;
    });

    ns1.innerHTML("Since: " + config.start.toString());
    ns2.innerHTML("Data received: " + (total.receive / 1000).toFixed(2) + "Kb");
    ns3.innerHTML("Data sent: " + (total.send / 1000).toFixed(2) + "Kb")

//     ns1.innerHTML("up: " + request.result.data[1].rxBytes + " down: " + request.result.data[1].txBytes);
 //    ns2.innerHTML("up: " + request.result.data[0].rxBytes + " down: " + request.result.data[0].txBytes);

   } 

   request.onerror = function () {
     console.log("Something goes wrong: " + request.error);
   }

 }else{
   ns2.innerHTML = "no mozNetworkStats";
 }

// var fakeRecord = { Interval:"1 1:30", Name: "wifinetwork", 
//                    ConnectionType: "wfifi", Metered: false, Bandwidth: 2939, 
//                    SignalStrength: 25, DataRecieved: 444, DataSent: 535};

//  addRecord(fakeRecord);
//  fakeRecord = { Interval:"1 1:30", Name: "belkin", 
//                    ConnectionType: "wfifi", Metered: false, Bandwidth: 2939, 
//                    SignalStrength: 25, DataRecieved: 444, DataSent: 535};

//  addRecord(fakeRecord);
//collectNetworkStats();
  
  generateFakeDay(7, 1);
//  printDay(4);

  var d = new Date();
  var timeout = (15-d.getMinutes()%15)*60000;

//var timeout = 3000;

  window.setTimeout(
    function(){
      collectNetworkStats();
      window.setInterval(  function(){collectNetworkStats()},rate);
    },(timeout));
  
}

function collectNetworkStats(){
 
  var d = new Date();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var Interval = d.getDay() + " " + d.getHours() + ":" +  d.getMinutes();

  var Name = "linksys";

  var ConnectionType = "wifi";
  //var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  //var ConnectionType = connection.type;
  
  var Metered = false;


  var Bandwidth = 2000;


  var SignalStrength = 2; //wifi - WiFi Information API, mobile - Mobile Connection API


  var DataRecieved =3000; //navigator.mozNetworkStats


  var DataSent= 4000; //navigator.mozNetworkStats
  

//gps
  var Latitude = null;
  var Longitude = null;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      Latitude = position.coords.latitude;
      Longitude = position.coords.longitude;
    });
  } 


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
