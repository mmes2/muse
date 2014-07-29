/* 
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:        network_data_collector.js
* @ Author:      Mike Kuvelas     
* @ Date:         2014-07-22
* @ Version:     0.8
* @ Copyright:    Copyright(C) Mike Kuvelas. MPL 2.0
* 
* 
* Description:    On activation, the function collectNetworkStats will be called
*                 on an interval provided by the user or program. 
*                 collectNetworkStats will check current network connection 
*                 information and save it to a database through the 
*                 network_database interface
* 
* 
*/


//activate: When called, set alarms to call collectNetworkStats() at provided interval
//Should be called in ui.js when ready for deployment. Only useful when actually 
//running on a phone. Most APIs will not be available in an emulator

var netCollect = (function() { 
  "use scrict";
  
  var collector = {};

  collector.activate = function (PriorityLevel) {

    //var rate;
    var minutes;  

    var oneMinute = 60000; // ms
    if(PriorityLevel==1) { 
      //rate = 300000; 
      minutes = 5;    
    } else if(PriorityLevel==2) { 
      //rate = 600000; 
      minutes = 10;   
    } else if(PriorityLevel==3) { 
      //rate = 900000; 
      minutes = 15;
    } else if(PriorityLevel==4) { 
      //rate = 1800000;  
      minutes = 30; 
    } else { 
      //rate = 3600000; 
      minutes = 60;
    } 

    var d = new Date();
    var alarmId;
    var timeout = 10000; //(minutes - d.getMinutes() % minutes) * oneMinute;
    d.setTime(d.getTime() + timeout); 

    var collectAlarm = navigator.mozAlarms.add(d, "ignoreTimezone", {});


    collectAlarm.onsuccess = function () {
      console.log("alarm was scheduled for: " + d.toString());
          alarmId = this.result;
    };

    collectAlarm.onerror = function () {
      console.log("Unable to schedule alarm: " + this.error.name);
    };
    navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
      var d2 = new Date(); 
      console.log("Collection alarm fired at: " + d2.toString()); 

      if (alarmId) {
        //console.log("removing old alarm");
        navigator.mozAlarms.remove(alarmId);
      }else {
        console.log("no old alarm to remove");
      }

      collector.collectNetworkStats(function () {
        collector.activate(PriorityLevel);
      });

    });
  };

  
  
  //Collect network stats, send record to networkDatabase
  //Currently: a hot mess
  collector.collectNetworkStats = function (callback){ 
    var d = new Date();
    var Interval = d.getDay() + " " + d.getHours() + ":" +  d.getMinutes();

    var Name = null;
    var SignalStrength = null;

    if(navigator.mozWifiManager.connection.network){
      Name = navigator.mozWifiManager.connection.network.ssid;
      SignalStrength = navigator.mozWifiManager.connection.network.signalStrength;
    }else {
      console.log("no mozWifiManager");
    }

    var ConnectionType = null;
    var Metered = null;
    var Bandwidth = null;

    //Need a replacement for navigator.connection.. It holds no useful data
    if(navigator.connection) {
      var connection = navigator.connection || navigator.webkitConnection;
      ConnectionType = connection.type;
      Metered = connection.metered;
      Bandwidth = connection.bandwidth;
    }

    //GPS part. This might give bad data if geolocation not allowed by user
    var Latitude = false;
    var Longitude = false;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
      });
    }else { 
      console.out("no geolocation");
    }

    var DataRecieved = 0;
    var DataSent = 0;
    
    //Getting data sent and received
    if(navigator.mozNetworkStats){

      var end = new Date();    
      var start = new Date(end - 90000);

      var netStats = navigator.mozNetworkStats;
      var networks = netStats.getAvailableNetworks();  

      setTimeout(function () {}, 10000);


      networks.onsuccess = function () {
        console.log("in networks.onsuccess");
        var aNetwork = networks.result[0];

        var netSamples = netStats.getSamples(aNetwork, start, end); 
        netSamples.onsuccess = function () {
          var rData = netSamples.result.data;

          rData.forEach(function (chunk) {
            DataRecieved += chunk.rxBytes;
            DataSent += chunk.txBytes;
          });
        
          collector.collectNetworkStats.writeRecord();
        }
      };
    }else{
      DataRecieved = false; 
      DataSent= false; 
    }

    collector.collectNetworkStats.writeRecord = function() {
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
      collector.collectNetworkStats.printLogs();
      callback();
    }

    collector.collectNetworkStats.printLogs = function () {
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
    };
  };
  
  return collector;

}());


//This is commented out when committing to github. Should be activated in ui.js when going live
netCollect.activate(1);
