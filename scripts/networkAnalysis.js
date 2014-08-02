/*
* networkAnalysis.js
*   
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
*
* Description:    Analyses network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*
*
*/



// setup global network analysis object
var netStats = (function() {
	"use strict";
		
	// create empty object. Add properties and methods.
	var netstats = {};
	
	// add properties with default values.
	netstats.ready = false;   // Indicates whether NetStats is fully initialized.
	netstats.goodTimes = [];  // array of bools that indicate a good connection time. true or false
	netstats.deltaTime = 15;  // The number of minutes between network data points.
	netstats.errorCodes = {NET_STATS_DB_UNDEFINED:1, 
						   ERROR_OPENING_DATABASE:2, 
						   NO_GOOD_CONNECTION_TIME_TODAY:3};
	
	netstats.SUCCESS = 0;
	
	netstats.messages = ["Success",
	                     "Global object 'netStatsDB' is not undefined.",
	                     "Unknown error occured opening the network statistics data base.",
	                     "No good connection time was found for today."];
	
	// Default network statistics analysis tool. This can be replaced with any object that
	// has a 'runAnalysis' function and a 'date' property. Use duck typing. 
	// This can be set before or after calling init(). 
	// Example: netStats.analyzer = myAnalyserObject;
	netstats.analyser = {
		// Date that the analysis was run for. 
		date:null,
		
	    // Does analysis on bandwidth data to determine best times to connect to the Internet.
		// Analyses one day's data across the number of weeks stored in netStatsDB.
		// Param  date:Date object. If not passed in then the current date is used
		runAnalysis:function(date) {
			this.date = this.date || new Date();
			var records = netStatsDB.getRecordsDay(this.date.getDay());  // get records for today.
			var goodTimes = [];  // local variable version of netstats.goodTimes.
			var bool = null;  // temp variable used to simplify code.
			
			// Look at each record and determine if a network is present that has sufficient bandwidth.
			for (var i = 0; i < records.length ; ++i) {
				bool = this.bandwidthGood(records[i][0].Networks); // only looking at first data point in queue because using fake data.
				goodTimes.push(bool);
			}
			
			netStats.goodTimes = goodTimes;
			
			// Determine the number of minutes between data points.
			netStats.deltaTime = Math.floor(60 * 24 / records.length);
			
		},
		
		// Determines if there is sufficient bandwidth in the passed in list of network objects.
		// Param  networks:array of network objects. See networkDatabase.js getFakeNetworks() for example network object.
		bandwidthGood:function(networks) {
			var minGoodBandwidth = 500;
			for (var i = 0; i < networks.length; ++i) {
				if (networks[i].Bandwidth > minGoodBandwidth) {
					return true;
				}
			}				
			return false;
		}
	};
	
	
	/*
	 * ***************************************************************************************
	 * 	    ASYCHRONOUS METHODS
	 * ***************************************************************************************
	 */
	
	
	// Initialization function
	// Returns: Error code or netStatsDB.SUCCESS
	// Param onReadyCallback:function  Called when netStats is ready.
	netstats.init = function(onReadyCallback) {
		this.onReadyCallback = onReadyCallback;
		
		if (netStatsDB === "undefined") {
			return netStats.errorCodes.NET_STATS_DB_UNDEFINED;
		}
		
		netStatsDB.open(function(status) {
			if (status == netStatsDB.SUCCESS) {				
				netStats.analyser.runAnalysis();			
				netStats.ready = true;
				
				if (typeof netStats.onReadyCallback === "function"){
					netStats.onReadyCallback(netStats.SUCCESS);
			    }
				
			} else if (status == netStatsDB.errorCodes.DATABASE_EMPTY) {
				// Populate the DB with fake data and then do analysis.
				netStatsDB.generateFakeDays(new Date(), 28, 15);  // create four weeks of data at 15 minute increments.
				console.log("Finished generating Fake data.");
								
				netStatsDB.save(function(){});
				console.log("saved data base.");

				netStats.analyser.runAnalysis();				
				netStats.ready = true;
				
				if (typeof netStats.onReadyCallback === "function"){
					netStats.onReadyCallback(netStats.SUCCESS);
			    }
				
			} else {
				netStats.ready = false;
				
				console.log("netStats.init(): Error opening network data base.");
				if (typeof netStats.onReadyCallback === "function"){
					netStats.onReadyCallback(netStats.errorCodes.ERROR_OPENING_DATABASE);
			    }
			}
		});
			
		return netStats.SUCCESS;
	};
	
	
	/* 
	 * **************************************************************************************
	 * 	    SYCHRONOUS METHODS
	 * **************************************************************************************
	 */
	
	
	// Function for getting the next best time to try downloading data from the Internet.
	// Returns:Tuple  {date:Date, error:netStats.SUCCESS or error code}
	// Note: Looks at netStats.goodTimes array which defaults to the current day, but it can be a different
	// day if netStats.analyser.runAnalysis(date) is called with a different date before calling this method.
	netstats.nextBestDate = function() {
		var curDate = netStats.analyser.date;
		var curTotalMinutes = curDate.getHours() * 60 + curDate.getMinutes();
		var startIndex = Math.ceil(curTotalMinutes / netStats.deltaTime);
		var index = startIndex;
		
		for (; index < netStats.goodTimes.length; ++index) {
			if (netStats.goodTimes[index]) {
				break;
			}
		}
		
		if (index < netStats.goodTimes.length) {
			// Advance curDate to next good time.
			
			// Round current minutes up to next time interval.
			curTotalMinutes = (Math.floor(curTotalMinutes /  netStats.deltaTime) + 1) * netStats.deltaTime;
			// Add in the number of minutes needed to advance the time.
			var mins = curTotalMinutes + ((index - startIndex) * netStats.deltaTime);
			// convert total minutes to hours and minutes.
			var hours = Math.floor(mins / 60);
			mins = mins % 60;

			curDate.setHours(hours, mins, 0, 0);
			return {date:curDate, error:netStats.SUCCESS};
			
		} else {
			return {date:curDate, error:netStats.errorCodes.NO_GOOD_CONNECTION_TIME_TODAY};
		}
	};
	
	
	// return network statistics object to global name space.
	return netstats;
	
}());






