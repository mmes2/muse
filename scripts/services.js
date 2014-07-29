/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:       	networkAnalysis.js
* @ Authors:     	Joshua Willhite, Jeremy Sample   
* @ Last Update:    2014-07-24
* @ Version:   		0.1
* @ Copyright:    	Copyright(C) Joshua Willhite, Jeremy Sample. MPL 2.0
*
*
* Description:    Analyses network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*
*
*/

//Test Functions
function nextBestWindow() {
	var window = new Date().getTime() + 60000; // set window to 1 min from current time
	//var window = new Date().getTime() + 1200000; // set window to 2 min from current time
	//var window = new Date().getTime() + 300000; // set window to 5 min from current time
	console.log(window);
	return window;
}

function currentlyFetchable() {
	return false;
}

// call nextBestWindow to determine when to update stories
var fetch_date = nextBestWindow();
console.log(fetch_date);

//Helper function to create an alarm (avoids repeat code)
function createAlarm(fetch_date){
	console.log("inside creating alarm");
	var alarm_request = navigator.mozAlarms.add(fetch_date, "ignoreTimezone");
	alarm_request.onsuccess = function () {
		console.log("alarm was scheduled for" + fetch_date);
	};

	alarm_request.onerror = function () {
		console.log("Unable to schedule alarm: " + this.error.name);
	};
}

navigator.mozSetMessageHandler("fetcher_alarm", function (mozAlarm) {
	//check with network analysis to see if we can actually fetch stories
	if (currentlyFetchable()) {
		//call the fetcher
		go();
		// TODO: Implement listener or promise which ensure that fetcher has successfully
		// completed and then notify UI (if this is how UI will behave) to update.
	} else {
		// if this ends up being a bad time then we need to re-schedule(possible to get
		// caught in a loop with the network analysis tool here? how should we deal
		//with this?)
		
		fetch_date = nextBestFetch();
		createAlarm(fetch_date);
	}
});
