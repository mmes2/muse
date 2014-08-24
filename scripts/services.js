/*
* services.js
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
* Description:    Analyses network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*/

// setup global services object
var services = (function () {
	"use strict";
	
	var fetchDate;
	var alarmId;
	var retryTimes = 0;
	var retryLimit = 3;
	
	var srvs = {};
	
	/*
		ToDo: link listener to 'refresh button' so that fetch timer is only created when
		user hits button (or stories are read).
	*/
	
	srvs.activate = function(){

		var alarmManager = navigator.mozAlarms;
		var alarms = alarmManager.getAll();

		alarms.onsuccess = function () {
			var alarmList = alarms.result;
			
			if(alarmList){
				alarmList.forEach(function(alarm){
					console.log("removing alarm id:" + alarm.id);
					alarmManager.remove(alarm.id);
			
				});
			}
		};

		netStats.analyzer = fetcherAnalysis.analyzer;
		netStats.nextBestDate = fetcherAnalysis.nextBestDate;

		//Get new stories on program launch if connected to a good source
		if(netStats.currentlyFetchable()) {
			
			fetcher.fetchNews(20,function () {
				var n = new Notification("Muse", {body: "New stories have been loaded"});	
			});
		
		}
												
		srvs.start();
		
	};
	
	srvs.start = function() {
	
		netStats.init(function()
									{
										fetchDate = netStats.nextBestDate(); 
										createAlarm(fetchDate.date);							
									});


		netCollect.activate(1);
		
  };

	//Helper function to create an alarm
	var createAlarm = function (fetchTime){
		
    
		if(fetchTime !== null){
			/*Set fetch time for 10 seconds before analysis returned date
			Advantages: 1. Collection and fetcher won't be running at same time
			            2. Network use will be recorded over interval assigned, 
			               available next week for analysis
			*/
			fetchTime.setTime(fetchTime.getTime()-10000);
		  var alarm_request = navigator.mozAlarms.add(fetchTime, "ignoreTimezone", {});
			
			alarm_request.onsuccess = function () {
				console.log("Fetcher scheduled for: " + fetchTime.toString());
				alarmId = this.result;
			};

			alarm_request.onerror = function () {
				console.log("Unable to schedule fetcher: " + this.error.name);
			};
			
		}else{
			tryTomorrow.activate();
			
		}
	
	};
	
	srvs.refreshButton = function (callback) {
		
		if(netStats.currentlyFetchable()){
			
			
			fetcher.fetchNews(20,function () {
			  var n = new Notification("Muse", {body: "New stories have been loaded"});		
			//	storyCache.clean(function(){
					ui.update();				
					callback();
				//});
				
			});			
			
		}else{
			var n = new Notification("Muse", {body: "No strong Internet connection"});
			callback();
		}
		
	};
	
	navigator.mozSetMessageHandler("alarm", function (alarm) {
		
		
		if (alarmId) {
			navigator.mozAlarms.remove(alarmId);
			navigator.mozAlarms.remove(alarm.id);
		}
		
		console.log("Services: It's time to fetch stories!! " + alarm.date);

		if(netStats.currentlyFetchable()) {

			retryTimes = 0;
			
			fetcher.fetchNews(20,function () {
				ui.update();
				
				setTimeout(function (){			
					var fetchTime = netStats.nextBestDate();
					createAlarm(fetchTime.date);							

				}, 10000); //We started early, wait until after collection time to ask for next best date

			});
		}else{
			var d = new Date();
			
			//time to try again, 5 Minutes from now
			d.setTime(d.getTime() + 300000);

			var timeoutAlarm;
			
			if(retryTimes < retryLimit){
				retryTimes = retryTimes + 1;
			  timeoutAlarm = navigator.mozAlarms.add(d, "ignoreTimezone", {});	
			}else{
				retryTimes = 0;
				var fetchTime = netStats.nextBestDate();
				createAlarm(fetchTime.date);							
			}			
			

			timeoutAlarm.onsuccess = function () {
				
			};
			timeoutAlarm.onerror = function () {
				console.log("Unable to schedule fetcher: " + this.error.name);
			};

		}
		
	});
	
	return srvs;

}());
