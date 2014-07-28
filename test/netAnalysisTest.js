




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
	var error = netStats.init(makeServicesCall);
	if (error) {
		console.log("Error returned from netStats.init().");
	}
}


function makeServicesCall(error) {
	if (error) {
		console.log("Got error initializing netStats.");
		return;
	}
	
	var goodConnectionTime = netStats.nextBestDate();
	if (goodConnectionTime.error) {
		console.log("No good connection time today.");
		
	} else {
		console.log("A good time to connect is: " + goodConnectionTime.date);
	}
}

//testRecordCreation();

testNetAnalysis();


//netStatsDB.clear();

