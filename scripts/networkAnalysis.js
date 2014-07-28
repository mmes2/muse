/*
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
		
	// create singleton object for network statistics.
	var netstats = {};
	
	// add properties with default values.
	netstats.ready = false;   // Indicates whether NetStats is fully initialized.
	netstats.goodTimes = [];  // array of bools that indicate a good connection time. true or false
	netstats.deltaTime = 15;  // The number of minutes between network data points.
	netstats.errorCodes = {NET_STATS_DB_UNDEFINED:1, 
						   ERROR_OPENING_DATABASE:2, 
						   NO_GOOD_CONNECTION_TIME_TODAY:3
						   };
	netstats.SUCCESS = 0;
	
	// Initialization function
	// Returns: Error code or netStatsDB.SUCCESS
	// Param onReadyCallback:function  Called when netStats is ready.
	netstats.init = function(onReadyCallback) {
		this.onReadyCallback = onReadyCallback;
		
		if (netStatsDB === "undefined") {
			return netStats.errorCodes.NET_STATS_DB_UNDEFINED;
		}
		
		netStatsDB.open(function(status) {
			if (status == netStatsDB.SUCCESS || status == netStatsDB.errorCodes.DATABASE_EMPTY) {
				// Populate the DB with fake data and then do analysis.
				netStatsDB.generateFakeDays(new Date(), 28);
				console.log("Finished generating Fake data.");
				
				
				netStatsDB.save(function(){});
				console.log("saved data base.");

				var records = netStatsDB.getDay();     // get records for today.
				netStats.doBandwidthAnalysis(records);
				
				netStats.ready = true;
				
				if (typeof netStats.onReadyCallback === "function"){
					netStats.onReadyCallback(netStats.SUCCESS);
			    }
			} else {
				netStats.ready = false;
				
				console.log("netStats.init(): Error opening network data base");
				if (typeof netStats.onReadyCallback === "function"){
					netStats.onReadyCallback(netStats.errorCodes.ERROR_OPENING_DATABASE);
			    }
			}
		});
			
		return netStats.SUCCESS;
	};
	
	
	// Function for getting the next best time to try downloading data from the Internet.
	// Returns:Tuple  i.e {date:curDate, error:netStats.SUCCESS}
	// Note: Only examines the current day.
	netstats.nextBestDate = function() {
		var curDate = new Date();
		var curTotalMinutes = curDate.getHours() * 60 + curDate.getMinutes();
		var startIndex = Math.ceil(curTotalMinutes / netStats.deltaTime);
		var index = startIndex;
		
		for (; index < netStats.goodTimes.length; ++index) {
			if (netStats.goodTimes[index]) {
				break;
			}
		}
		
		if (index < netStats.goodTimes.length) {
			var bestTime = curDate.getMilliseconds() + ((index - startIndex) * netStats.deltaTime * 60 * 1000);
			curDate.setMilliseconds(bestTime);
			return {date:curDate, error:netStats.SUCCESS};
			
		} else {
			return {date:null, error:netStats.errorCodes.NO_GOOD_CONNECTION_TIME_TODAY};
		}
	};
	
	
	// Does analysis on bandwidth data to determine best times to connect to the Internet.
	// Private function
	netstats.doBandwidthAnalysis = function(records) {
		var goodTimes = [];
		var val = null;
		for (var i = 0; i < records.length ; ++i) {
			val = netStats.bandwidthGood(records[i][0].Networks); // only looking at first data point in queue for now.
			goodTimes.push(val);
		}
		
		netStats.goodTimes = goodTimes;
		netStats.deltaTime = Math.floor(60 * 24 / records.length);
		
	};
	
	
	// Determines if there is sufficient bandwidth in the passed in list of network objects.
	// Private function.
	netstats.bandwidthGood = function(networks) {
		var minGoodBandwidth = 500;
		for (var i = 0; i < networks.length; ++i) {
			if (networks[i].Bandwidth > minGoodBandwidth) {
				return true;
			}
		}
		
		return false;
	};
	
	
	// return network statistics object to global name space.
	return netstats;
	
}());






