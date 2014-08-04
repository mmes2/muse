/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.

* Description:    Analyzes network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*
*
*/
// call nextBestWindow to determine when to update stories
var fetch_date = nextBestWindow();
var thing = netStats.nextBestDate();

//Test Functions
function nextBestWindow() {
	var window = new Date().getTime() + 30000;
	//var window = new Date().getTime() + 60000; // set window to 1 min from current time
	//var window = new Date().getTime() + 1200000; // set window to 2 min from current time
	//var window = new Date().getTime() + 300000; // set window to 5 min from current time
	return window;
}

function testRecordCreation() {
	netStatsDB.open(openDone);
	
}

function openDone(value) {
	console.log("Data base opened.");
	console.log(value);
	netStatsDB.generateFakeDays(new Date(), 28);
	console.log("Finished generating Fake data.");
	netStatsDB.save(function(){});
	console.log("saved data base.");
	console.log(netStatsDB.data);
	var day = netStatsDB.getDay();
	console.log(day);
}

function currentlyFetchable() {
	return false;
}
///////////////End of Test functions

//Helper function to create an alarm (avoids repeat code)
function createAlarm(fetch_date){
	var alarm_request = navigator.mozAlarms.add(fetch_date, "ignoreTimezone", {main: "services"});
	alarm_request.onsuccess = function () {
		console.log("alarm was scheduled for " + fetch_date);
	};

	alarm_request.onerror = function () {
		console.log("Unable to schedule alarm: " + this.error.name);
	};
}

createAlarm(fetch_date);

navigator.mozSetMessageHandler("alarm", function (mozAlarm) {
	console.log("alarm fired")
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
		
		fetch_date = nextBestWindow();
		createAlarm(fetch_date);
	}
});
