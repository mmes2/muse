/*
* services.js
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* Description:    Analyses network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*/


// setup global services object
var services = (function () {
	"use strict";

	var srvs = {};


	//Helper function to create an alarm (avoids repeat code)
	function createAlarm(fetch_date){
		var alarm_request = navigator.mozAlarms.add(fetch_date, "ignoreTimezone", {});
		alarm_request.onsuccess = function () {
			console.log("alarm was scheduled for: " + fetch_date);
			var srvsAlarmId = this.result;
		};

		alarm_request.onerror = function () {
			console.log("Unable to schedule alarm: " + this.error.name);
		};
	};

	navigator.mozSetMessageHandler("alarm", function (alarm) {
		//check to make sure this is the correct alarm id [For now assume it's the correct alarm]
		if (true) {
			console.log('ALARM!: ' + new Date())
			//check with network analysis to see if we can actually fetch stories [no 'currentlyFetchable()' implemented so we'll assume there is network access]
			if (true) {
				//call the fetcher[currently this isn't working due to the ajax call in source]
				fetcher.fetchNews(10, srvs.fetcher_callback);
				// TODO: Implement listener or promise which ensure that fetcher has successfully
				// completed and then notify UI (if this is how UI will behave) to update.
			} else {
				// if this ends up being a bad time then we need to re-schedule(possible to get
				// caught in a loop with the network analysis tool here? how should we deal
				//with this?)		
				var time = new Date();
				var fetch_date = new Date(time.getTime() + 5000);
				fetch_date = nextBestFetch();
				createAlarm(fetch_date);
			}
			navigator.mozAlarms.remove(alarmId);
		}
	});

	srvs.fetcher_callback = function fetcher_callback(){
		console.log('fetched stories!!');
	};
	
	// call nextBestWindow to determine when to update stories
	// this throws a "TypeError: curDate is null" on line 151 of networkAnalysis.js
	//var fetch_date = netStats.nextBestDate();
	var curr_time = new Date();
	console.log('CURRENT TIME: ' + curr_time);
	var fetch_date = new Date(curr_time.getTime() + 5000);

	createAlarm(fetch_date);

	// return services object to global name space.
	return services;
}());

