/* 
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:        networkDataCollector.js
* @ Author:      Mike Kuvelas     * 
* 
* Description:    On activation, starts collection cycle to store internet 
*                 connectivity conditions on supplied interval
* 
* 
*/


var netCollect = (function() { 
  "use strict";
  
  var collector = {};

  collector.StartTime = new Date();
  collector.EndTime = collector.StartTime;
  collector.Latitude = null;
  collector.Longitude = null;
  
  collector.WifiDataReceived = null;
  collector.WifiDataSent = null;
  collector.WifiNetwork = null;
  collector.WifiData = null;
  collector.WifiLinkSpeed = null;
  collector.WifiSignalStrength = null;
  
  collector.MobileSignalStrength = null;
  collector.MobileNetwork = null;
  collector.MobileData = null;
  collector.MobileRoaming = null;
  
  var rate = null;
  var minutes = null;

  /*activate: 
  Arguments: An integer to represent priority level
  Returns: null
  Description: Initiates rate and minutes variables for provided interval
  Should be called in services.js when ready for deployment. Only useful when actually 
  running on a phone. Most APIs will not be available in an emulator
  will not call collectCycle if running in emulator. */
  
 
  collector.activate = function (PriorityLevel) {

    
    if(navigator.mozNetworkStats){

      /*Run when netStats object is created to 
      * clear rx/tx values before first collection
      */
      collector.setSentRecieved(function () {
        console.log("cleared sent/received data");
      });
      
      var alarmManager = navigator.mozAlarms;
      var alarms = alarmManager.getAll();

      if(PriorityLevel===1) { 
          rate = 300000; 
          minutes = 5;    
      } else if(PriorityLevel===2) { 
        rate = 600000; 
        minutes = 10;   
      } else if(PriorityLevel===3) { 
        rate = 900000; 
        minutes = 15;
      } else if(PriorityLevel===4) { 
        rate = 1800000;  
        minutes = 30; 
      } else { 
        rate = 3600000; 
        minutes = 60;
      } 

      //Clear any alarms that might be scheduled
      //This needs to come out of my code and into services
      //Needs to be run once so alarms from last time program was loaded are cleared
      alarms.onsuccess = function () {
        var alarmList = alarms.result;

        if(alarmList){
          alarmList.forEach(function(alarm){
            console.log("removing alarm id:" + alarm.id);
            alarmManager.remove(alarm.id);
          });
        }  
        
        //This part will stay in my code
        //Open database, if success, begin collection cycle
        netStatsDB.open(function(status) {
			    if (status == netStatsDB.SUCCESS) {				
            netStatsDB.open(collectCycle());
          }
        });
      };
      
    }else{
      //Collecting network stats is not possible on an emulator
      console.log("Using emulator, network data collector shutting down");
    }
        
  };
  
  /*collectCycle:
    Description: Finds next collection interval, sets timer for that time, calls collectNetworkStats with self as callback
  */
  var collectCycle = function () {
  
    var oneMinute = 60000; // ms
    var oneSecond = 1000;
    
    var d = new Date();
    var alarmId; 
    //Calculate next collection cycle to the second
    var timeout = (minutes - d.getMinutes() % minutes) * oneMinute - (d.getSeconds() * oneSecond);
    
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

    navigator.mozSetMessageHandler("alarm", function (alarm) { 
      collector.EndTime = new Date(); 
      console.log("Ending collection at: " + collector.EndTime); 
      
      //One or both of these may not be required
      //will do more testing later
      if (alarmId) {
        navigator.mozAlarms.remove(alarmId);
        navigator.mozAlarms.remove(alarm.id);
      }

      collector.collectNetworkStats(function () {
        netStatsDB.save(collectCycle());
        
      });

    });
  };
  
  //Collect network stats, send record to networkDatabase
  collector.collectNetworkStats = function (callback){ 
    
    if(navigator.mozWifiManager){
      if(navigator.mozWifiManager.connection){
      
        if(navigator.mozWifiManager.connection.status === "connected"){
          collector.WifiData = true;
          collector.WifiNetwork = navigator.mozWifiManager.connection.network.ssid;
          collector.WifiLinkSpeed = navigator.mozWifiManager.connectionInformation.linkSpeed;  //in Mb/s
          collector.WifiSignalStrength = navigator.mozWifiManager.connectionInformation.relSignalStrength;
        }else{
          collector.WifiData = false;
          collector.WifiNetwork = null;
          collector.WifiLinkSpeed = null;
          collector.WifiSignalStrength = null;
        }
        
      }
    }else {
      console.log("no mozWifiManager - THIS SHOULD NEVER HAPPEN!");
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
          collector.MobileBandwidth = "unknown";  //Not sure how I am collecting this yet
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
      console.log("no mozMobileConnections - THIS SHOULD NEVER HAPPEN!");
    }

    
    collector.setGeolocation(function () {
          
      collector.setSentRecieved(function () {
      
          writeRecord();
          netStatsDB.save(callback());

      });
      
    });
        
///////Synchronous Helper Functions of netCollect///////
    
    var writeRecord = function() {

      //Remove after debugging
      collector.collectNetworkStats.printLogs();

      netStatsDB.addRecord( collector.EndTime.getDay() + " " + collector.EndTime.getHours() + ":" +  collector.EndTime.getMinutes(),
      { 
        "Start": collector.StartTime,
        "End": collector.EndTime,
        "Latitude":collector.Latitude,
        "Longitude":collector.Longitude,
        "Wifi":{
          "Connected":collector.WifiData,
          "NetworkName":collector.WifiNetwork, 
          "Bandwidth":collector.WifiLinkSpeed, 
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
      
    };


    //Print record logs. Will not be needed after debugging, but will stay for future improvement testing
    collector.collectNetworkStats.printLogs = function () {
      console.log("****Collection Record****");
      console.log("Latitude: "+ collector.Latitude);
      console.log("Longitude: " + collector.Longitude);
      console.log("Start Time: " + collector.StartTime);
      console.log("End Time: " + collector.EndTime);
      
      if(collector.WifiData === true){
        console.log("Wifi Network Name: " + collector.WifiNetwork);
        console.log("Wifi Link Speed: "+ collector.WifiLinkSpeed + " Mb/s");  
        console.log("Wifi SignalStrength: " + collector.WifiSignalStrength + "%");
        console.log("Wifi DataReceived: "+ collector.WifiDataReceived + " bytes");
        console.log("Wifi DataSent: " + collector.WifiDataSent + " bytes");
      }else {
        console.log("No Wifi Connection");
      }
      
      if(collector.MobileData === true){
        console.log("Mobile Network Name: " + collector.MobileNetwork);
        console.log("Mobile DataReceived: "+ collector.MobileDataReceived + " bytes");
        console.log("Mobile DataSent: " + collector.MobileDataSent + " bytes");
      }else{
        console.log("No Mobile Connection");
      }
      
      console.log("****End of Record****");
    };
  };
  
  //For networkAnalysis to use in currentlyFetchable() interface
  collector.currentWifiInfo = function () {
    var infoPack = {};
    infoPack.WifiData = false;
    infoPack.WifiNetwork = null;
    infoPack.WifiLinkSpeed = null;
    infoPack.WifiSignalStrength = null;
    
    if(navigator.mozWifiManager){
    
      if(navigator.mozWifiManager.connection){
      
        if(navigator.mozWifiManager.connection.status === "connected"){
          infoPack.WifiData = true;
          infoPack.WifiNetwork = navigator.mozWifiManager.connection.network.ssid;
          infoPack.WifiLinkSpeed = navigator.mozWifiManager.connectionInformation.linkSpeed;  //in Mb/s
          infoPack.WifiSignalStrength = navigator.mozWifiManager.connectionInformation.relSignalStrength;
        }
      }
    } 
    
    return infoPack;
    
  };
  
  //For networkAnalysis to use in currentlyFetchable() interface when running in emulator
  //This could be combined with currentWifiInfo, but it should be clear that we are returning FAKE data
  collector.fakeCurrentWifiInfo = function () {
    var infoPack = {};
    infoPack.WifiData = true;
    infoPack.WifiNetwork = "fake network";
    infoPack.WifiLinkSpeed = 32;
    infoPack.WifiSignalStrength = 99; 
    
    return infoPack;
    
  };


  ///////Asynchronous Helper Functions of netCollect///////

  /*setGeolocation
    Arguments: callback function
    Description: sets latitude and longitude variables if possible
    Works most of the time, will not work in basements or other random times
    timeout added to getCurrentPosition call because its default timeout is INFINITE!
    It's not important enough to wait around, literally, forever
    */

  collector.setGeolocation = function(callback) {
      
    if (navigator.geolocation) {
 
      var success = function (place) {
        collector.Latitude = place.coords.latitude;
        collector.Longitude = place.coords.longitude;
        callback();       
      };
      
      var error = function () {
        console.log("GPS unavailable");
        collector.Latitude = null;
        collector.Longitude = null;
  
        callback();
      };
      
      navigator.geolocation.getCurrentPosition(success,error, {timeout:10000});
            
    }else { 
      console.log("no navigator.geolocation");
      callback();
    }
   
  };
  
  /*setSentRecieved:
    Collects sent and received bytes since last collection
    Works for both wifi and mobile connections
    Waits a second to call back so forEach loop has time to finish
    */
  collector.setSentRecieved = function (callback) {
    
    if(navigator.mozNetworkStats){

      var netStats = navigator.mozNetworkStats;
      var networks = netStats.getAvailableNetworks();  

      networks.onsuccess = function () {
        
        var result = networks.result;
        var netSamples;
        
        result.forEach(function (aNetwork) {
          netSamples = netStats.getSamples(aNetwork, collector.StartTime, collector.EndTime);   
        
          netSamples.onsuccess = function () {
            var rData = netSamples.result.data;

            if(aNetwork.id === "0"){
              collector.WifiDataReceived = rData[0].rxBytes;
              collector.WifiDataSent = rData[0].txBytes; 
            }else if(aNetwork.id === "1"){
              collector.MobileDataReceived = rData[0].rxBytes;
              collector.MobileDataSent = rData[0].txBytes; 
            }

            //Do I need this timeout?
            setTimeout(function () {
              netStats.clearAllStats(); 
              callback();} ,1000);       
          };
          
        });
       
      }; 
    }
  };


  return collector;

}());


//This is commented out when committing to github. Should be activated in services.js asap
//netCollect.activate(3);
