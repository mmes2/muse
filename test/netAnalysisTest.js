




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


function testNetAnalysis() {
	if (typeof netStats == "undefined") {
		console.log("Error: Global object netStats is undefined.");
		return;
	}
	
	var error = netStats.init(makeServicesCall);
	if (error) {
		console.log("Error: " + netStats.messages[error]);
		// Handle error.
	}
}


function makeServicesCall(error) {
	if (error) {
		console.log("Error: " + netStats.messages[error]);
		// Handle error.
		return;
	}
	
	// All is good. Get next best time to connect to the Internet.
	var goodConnectionTime = netStats.nextBestDate();
	if (goodConnectionTime.error) {
		console.log("Error: " + netStats.messages[goodConnectionTime.error]);
		if (goodConnectionTime.error == netStats.NO_GOOD_CONNECTION_TIME_TODAY) {
			// Can try another day. 
			// Example of trying next day. Not tested.
			// var date = new Date();
			// var nextDay = date.getMilliseconds() + (24 * 60 * 60 * 1000);
			// date.setMilliseconds(newTime);
			// netStats.analyser.runAnalysis(date);
			// goodConnectionTime = netStats.nextBestDate();
		}
		
	} else {
		console.log("A good time to connect is: " + goodConnectionTime.date);
		
		// CurrentlFetchable test code
		if (netStats.currentlyFetchable()) {
			// Code that does something.
			console.log("currentlyFetchable returned True.");
		} else {
			console.log("currentlyFetchable returned False.");
		}
		
	}
}


testNetAnalysis();


//testRecordCreation();
//netStatsDB.clear();




