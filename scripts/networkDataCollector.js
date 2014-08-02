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

  collector.StartTime = new Date();
  collector.EndTime = collector.StartTime;
  collector.Latitude = null;
  collector.Longitude = null;
  
  collector.WifiDataReceived = null;
  collector.WifiDataSent = null;
  collector.WifiNetwork = null;
  collector.WifiData = null;
  collector.WifiBandwidth = null;
  collector.WifiSignalStrength = null;
  
  collector.MobileSignalStrength = null;
  collector.MobileNetwork = null;
  collector.MobileData = null;
  collector.MobileRoaming = null;
  
  
  
 
  collector.activate = function (PriorityLevel) {

    //var rate;
    var minutes;  

    var oneMinute = 60000; // ms
    if(PriorityLevel==1) { 
      rate = 300000; 
      minutes = 5;    
    } else if(PriorityLevel==2) { 
      rate = 600000; 
      minutes = 10;   
    } else if(PriorityLevel==3) { 
      rate = 900000; 
      minutes = 15;
    } else if(PriorityLevel==4) { 
      rate = 1800000;  
      minutes = 30; 
    } else { 
      rate = 3600000; 
      minutes = 60;
    } 

    var d = new Date();
    var alarmId;
    var timeout = (minutes - d.getMinutes() % minutes) * oneMinute - (d.getSeconds() * 1000);
    d.setTime(d.getTime() + timeout); 

    var collectAlarm = navigator.mozAlarms.add(d, "ignoreTimezone", {});


    collectAlarm.onsuccess = function () {
      collector.StartTime = new Date(); 
      console.log("Starting collection at: " + collector.StartTime);
      alarmId = this.result;
    };

    collectAlarm.onerror = function () {
      console.log("Unable to schedule alarm: " + this.error.name);
    };
    navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
      collector.EndTime = new Date(); 
      console.log("Ending collection at: " + collector.EndTime); 
      
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
          collector.WifiData = true;
          collector.WifiNetwork = navigator.mozWifiManager.connection.network.ssid;
          collector.WifiBandwidth = navigator.mozWifiManager.connectionInformation.linkSpeed;  //in Mb/s
          collector.WifiSignalStrength = navigator.mozWifiManager.connectionInformation.relSignalStrength;
        }else{
          collector.WifiData = false;
          collector.WifiNetwork = null;
          collector.WifiBandwidth = null;
          collector.WifiSignalStrength = null;
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
          collector.MobileData = true;
          collector.MobileNetwork = mData.network;
          collector.MobileSignalStrength = mData.relSignalStrength;          
          collector.MobileBandwidth = "unknown";
          collector.MobileRoaming = mData.roaming;
          collector.MobileMetered = true;
        }else{
          collector.MobileData = false;
          collector.MobileNetwork = null;
          collector.MobileSignalStrength = null;          
          collector.MobileBandwidth = null;
          collector.MobileRoaming = null;
          collector.MobileMetered = null;
        }  
    }else {
      console.log("no mozMobileConnections");
    }

    
    collector.setGeolocation(function () {
          
      collector.setSentRecieved(function () {
      
          collector.collectNetworkStats.writeRecord();
          callback();

      });
      
    });
    

///////////////collectNetworkStats Helper functions/////////////////

    
    collector.collectNetworkStats.writeRecord = function() {

      collector.collectNetworkStats.printLogs();

      netStatsDB.addRecord( 
      { 
        "Start": collector.StartTime,
        "End": collector.EndTime,
        "CollectionDate":d,
        "Latitude":collector.Latitude,
        "Longitude":collector.Longitude,
        "Wifi":{
          "Connected":collector.WifiData,
          "NetworkName":collector.WifiNetwork, 
          "Bandwidth":collector.WifiBandwidth, 
          "SignalStrength":collector.WifiSignalStrength,
          "DataReceived":collector.WifiDataReceived,
          "DataSent":collector.WifiDataSent        
        },
        Mobile:{
          "Connected":collector.MobileData,
          "NetworkName":collector.MobileNetwork,
          "Bandwidth":collector.MobileBandwidth,
          "SignalStrength":collector.MobileSignalStrength,
          "DataReceived":0,
          "DataSent":0,
          "Roaming":collector.MobileRoaming,
          "Metered":collector.MobileMetered          
        }
      
      });
      
      //callback();
    };


    collector.collectNetworkStats.printLogs = function () {
      console.log("****Collection Record****");
      console.log("Wifi Network Name: " + collector.WifiNetwork);
      
      
      console.log("Wifi Bandwidth: "+ collector.WifiBandwidth + " Mb/s");  
      console.log("Wifi SignalStrength: " + collector.WifiSignalStrength + "%");
      console.log("Wifi DataReceived: "+ collector.WifiDataReceived + " bytes");
      console.log("Wifi DataSent: " + collector.WifiDataSent + " bytes");
      console.log("Latitude: "+ collector.Latitude);
      console.log("Longitude: " + collector.Longitude);
      console.log("****End of Record****");
    };
  };

  
///////////////collector Helper functions/////////////////

  collector.setGeolocation = function(callback) {
  
    var geoTest = navigator.geolocation;
    
    if (navigator.geolocation) {

      var success = function (place) {
        collector.Latitude = place.coords.latitude;
        collector.Longitude = place.coords.longitude;
        callback();       
      };
      
      var error = function (place) {
        console.log("GPS denied by user");
        callback();
      };
      
      navigator.geolocation.getCurrentPosition(success,error);
            
    }else { 
      console.log("no geolocation");
      callback();
    }
    
    
  };
  
  collector.setSentRecieved = function (callback) {
 
    if(navigator.mozNetworkStats){

      var netStats = navigator.mozNetworkStats;
      var networks = netStats.getAvailableNetworks();  

      networks.onsuccess = function () {
        var aNetwork = networks.result[0];

        var netSamples = netStats.getSamples(aNetwork, collector.StartTime, collector.EndTime); 

        netSamples.onsuccess = function () {
          var rData = netSamples.result.data;
          
          collector.WifiDataReceived = rData[0].rxBytes;
          collector.WifiDataSent = rData[0].txBytes; 
          
          setTimeout(function () {
            netStats.clearAllStats(); 
            callback();}
                     ,1000);       
        };
        
      }; 
    }
  };

  ///////////////Clear rx/tx values before first collection/////////////////
  collector.setSentRecieved(function () {
    console.log("cleared sent/received data");
  });

  return collector;

}());


//This is commented out when committing to github. Should be activated in ui.js when going live
netCollect.activate(1);
