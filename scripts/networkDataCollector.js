/* 
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:        networkDataCollector.js
* @ Author:      Mike Kuvelas     * 
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

  collector.currentSent = null;
  collector.currentReceived = null;
 

  collector.oldDataSent = null;
  collector.oldDataReceived = null;


  collector.DataReceived = null;
  collector.DataSent = null;
  collector.Name = null;
  collector.ConnectionType = null;
  collector.Name = null;
  collector.Bandwidth = null;
  collector.SignalStrength = null;
  collector.mobileSignalStrength = null;
  collector.mobileNetwork = null;
  collector.mobileData = null;
  collector.Latitude = false;
  collector.Longitude = false;
 
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
    var timeout = 10000 //(minutes - d.getMinutes() % minutes) * oneMinute - (d.getSeconds() * 1000);
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
        navigator.mozAlarms.remove(alarmId);
      }

      collector.collectNetworkStats(function () {
        collector.activate(PriorityLevel);
      });

    });
  };

  
  
  //Collect network stats, send record to networkDatabase
  collector.collectNetworkStats = function (callback){ 
    var d = new Date();
    var Interval = d.getDay() + " " + d.getHours() + ":" +  d.getMinutes();

    
    if(navigator.mozWifiManager){
      if(navigator.mozWifiManager.connection){
      
        if(navigator.mozWifiManager.connection.status === "connected"){
          collector.ConnectionType = "wifi";
          collector.Name = navigator.mozWifiManager.connection.network.ssid;
          collector.Bandwidth = navigator.mozWifiManager.connectionInformation.linkSpeed;  //in Mb/s
          collector.SignalStrength = navigator.mozWifiManager.connectionInformation.relSignalStrength;
        }
      }
    }else {
      console.log("no mozWifiManager");
    }

    
    if(navigator.mozMobileConnections){
      var tempMobile = navigator.mozMobileConnections; 
      
      ////This for each loop not working for some reason. Only testing first sim card for now
      //tempMobile.forEach(function (aConnection) {
        
        //var mData = aConnection.data;
        var mData = tempMobile[0].data;
        
        if(mData.connected === true){
          collector.mobileData = true;
          collector.mobileNetwork = mData.network;
          collector.mobileSignalStrength = mData.signalStrength;          
          collector.mobileBandwidth = "unknown";
        }  
    }else {
      console.log("no mozMobileConnections");
    }

    
    var Metered = null;
    /*Need a replacement for navigator.connection.. It holds no useful data
       */
    if(navigator.connection) {
      var connection = navigator.connection || navigator.webkitConnection;
      Metered = connection.metered;
    }


    //GPS part. This might give bad data if geolocation not allowed by user
    var geoTest = navigator.geolocation;
    
    if (navigator.geolocation) {

      var success = function (place) {
        collector.Latitude = place.coords.latitude;
        collector.Longitude = place.coords.longitude;
      };
      
      var error = function (place) {
        console.log("Couldn't get gps position");
      };
      
      navigator.geolocation.getCurrentPosition(success,error);
            
    }else { 
      console.out("no geolocation");
    }

    
    
    
    
    
    //delete this, its for testing
    
      var end = new Date();    
      var start = new Date(end-90000);
    
      var netStats = navigator.mozNetworkStats;
      var networks = netStats.getAvailableNetworks();  

      networks.onsuccess = function () {
        var aNetwork = networks.result[0];

        var receive = 0;
        var send = 0;
        
        var netSamples = netStats.getSamples(aNetwork, start, end); 

        

        
        netSamples.onsuccess = function () {

          
          
          var rData = netSamples.result.data;
          
          rData.forEach(function (chunk) {
            receive += chunk.rxBytes;
            send    += chunk.txBytes;
            console.log("**Rec: " + receive);
            console.log("**Sent: " + send);
          });
          
          
          
        };
        
      }; 

    /////////////////////////
    
    
    
    
    
    
    
    
    
    
    
    
    //Getting data sent and received
    collector.getSentRecieved(function () {
      collector.DataReceived = collector.currentReceived - collector.oldDataReceived;
      collector.oldDataReceived = collector.currentReceived;
      collector.DataSent = collector.currentSent - collector.oldDataSent;
      collector.oldDataSent = collector.currentSent;    
    
      setTimeout(function () {
        collector.collectNetworkStats.writeRecord();
        callback();
      }, 10000);
  
    });


///////////////Helper functions/////////////////

    collector.collectNetworkStats.writeRecord = function() {

      collector.collectNetworkStats.printLogs();

      netStatsDB.addRecord( 
      { "Interval":Interval, 
        "CollectionDate":d,
        "Name":collector.Name, 
        "ConnectionType":collector.ConnectionType, 
        "Metered":Metered,
        "Bandwidth":collector.Bandwidth, 
        "SignalStrength":collector.SignalStrength,
        "DataReceived":collector.DataReceived,
        "DataSent":collector.DataSent,
        "Latitude":collector.Latitude,
        "Longitude":collector.Longitude
      });
      
      //callback();
    };


    collector.collectNetworkStats.printLogs = function () {
      console.log("****Collection Record****");
      console.log("Network Name: " + collector.Name);
      console.log("Connection Type: " + collector.ConnectionType);
      console.log("Metered: " +  Metered);
      console.log("Bandwidth: "+ collector.Bandwidth + " Mb/s");  
      console.log("SignalStrength: " + collector.SignalStrength + "%");
      console.log("DataReceived: "+ collector.DataReceived + " bytes");
      console.log("DataSent: " + collector.DataSent + " bytes");
      console.log("Latitude: "+ collector.Latitude);
      console.log("Longitude: " + collector.Longitude);
      console.log("****End of Record****");
    };
  };

  collector.getSentRecieved = function (callback) {
 
    if(navigator.mozNetworkStats){

      var end = new Date();    
      var start = new Date(end);

      var netStats = navigator.mozNetworkStats;
      var networks = netStats.getAvailableNetworks();  

      networks.onsuccess = function () {
        var aNetwork = networks.result[0];

        var netSamples = netStats.getSamples(aNetwork, start, end); 

        netSamples.onsuccess = function () {
          var rData = netSamples.result.data;
          //console.log("**Rec: " + rData[0].rxBytes);
          //console.log("**Sent: " + rData[0].txBytes);
          collector.currentReceived = rData[0].rxBytes;
          collector.currentSent = rData[0].txBytes; 
        };
        
      }; 
     setTimeout(callback(),1000);       
    }
  };

  collector.getSentRecieved(function () {
      collector.oldDataReceived = collector.currentReceived;
      collector.oldDataSent = collector.currentSent;      
  });

  return collector;

}());


//This is commented out when committing to github. Should be activated in ui.js when going live
netCollect.activate(1);
