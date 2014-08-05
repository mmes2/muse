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

	var srvs = {};
	
	
	//var fetchDate = netStats.nextBestDate(); // fails due to error
	var curr_time = new Date();
	var fetchDate = new Date(curr_time.getTime() + 5000);

	//Helper function to create an alarm (avoids repeat code)
	function createAlarm(fetchDate){
		var alarm_request = navigator.mozAlarms.add(fetchDate, "ignoreTimezone", {});
		alarm_request.onsuccess = function () {
			console.log("Fetcher scheduled for: " + fetchDate);
		};

		alarm_request.onerror = function () {
			console.log("Unable to schedule fetcher: " + this.error.name);
		};
	};
	
	createAlarm(fetchDate);

	navigator.mozSetMessageHandler("alarm", function (alarm) {
		// Check to see if the alarm time matches current time if it does fetch stories
		// otherwise phone has been off so start a new timer
		// May need to change logic to check if fetchable first and then just go get stories
		
		console.log('Fetcher Alarm!: ' + alarm.date);
		
		var fetchDateMatch = false;
		curr_time = new Date();
		console.log('Current: ' + curr_time);
		console.log('Alarm: ' + alarm.date);
		if (alarm.date.toString() === curr_time.toString()) 
			fetchDateMatch = true;
		
		if (fetchDateMatch) {
			//check with network analysis to see if we can actually fetch stories [no 'currentlyFetchable()' implemented so we'll assume there is network access]
			console.log("Successful Match, test Fetchablility.")
			if (true) {
				//call the fetcher[currently this isn't working due to the ajax call in source]
				fetcher.fetchNews(10, srvs.fetcher_callback);
				// TODO: Implement listener to ensure that fetcher has successfully
				// completed and then notify UI (if this is how UI will behave) to update.
			} else {
				
				//fetchDate = netStats.nextBestDate(); // fails due to error
				
				//Can delete these once above works
				curr_time = new Date();
				fetchDate = new Date(curr_time.getTime() + 5000);
				createAlarm(fetchDate);
			}
			
		} else {
				//fetchDate = netStats.nextBestDate(); // fails due to error
				console.log("NO MATCH");
			
				//Can delete these once above works
				curr_time = new Date();
				fetchDate = new Date(curr_time.getTime() + 5000);
				createAlarm(fetchDate);
		}
	});

	srvs.fetcher_callback = function fetcher_callback(){
		console.log('fetched stories!!');
	};

}());


