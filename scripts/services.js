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
			fetcher.fetchNews(20,function () {});
		
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
		ui.update();
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
	
	
	navigator.mozSetMessageHandler("alarm", function (alarm) {
		
		
		if (alarmId) {
			navigator.mozAlarms.remove(alarmId);
			navigator.mozAlarms.remove(alarm.id);
		}
		
		console.log("Services: It's time to fetch stories!! " + alarm.date);

		if(netStats.currentlyFetchable()) {

			fetcher.fetchNews(20,function () {
				ui.update();
				
				setTimeout(function (){			
					createAlarm(netStats.nextBestDate());							

				}, 10000); //We started early, wait until after collection time to ask for next best date

			});
		}else{
			var d = new Date();
			
			//time to try again, 5 Minutes from now
			d.setTime(d.getTime() + 300000);
			
			//TODO: add counter so we can stop retrying after a few attempts. 
			//Should call tryTomorrow if that happens
			
			var timeoutAlarm = navigator.mozAlarms.add(d, "ignoreTimezone", {});

			timeoutAlarm.onsuccess = function () {
				console.log("No Internet connection, trying again at: " + d.toString());
				alarmId = this.result;
			};

			timeoutAlarm.onerror = function () {
				console.log("Unable to schedule fetcher: " + this.error.name);
			};

		}
		
	});
	
	return srvs;

}());

services.activate();
