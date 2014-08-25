/*
* networkDatabase.js
*  
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
* 
*
* Description:    Data base for network statistics.
*
*
*/

// setup global network statistics data base
var netStatsDB = (function() {
	"use strict";
	
	var netDB = {}; // Empty shell for the network data base object
	
	// add properties to data base object with default values.
	netDB.data = [];     // This is all the data.
	netDB.queueSize = 4; // Maximum number of weeks that are keep in the data base.
	netDB.errorCodes = {DATABASE_EMPTY:1}; // Constants for error codes.
	netDB.SUCCESS = 0;  // returned from functions on success.
	
	// Message strings for error codes.
	netDB.messages = ["Success",
	                  "The network data base is empty."];
	
	/*
	 * ***************************************************************************************
	 * 	    ASYCHRONOUS METHODS
	 * ***************************************************************************************
	 */
	
	
	// Called to populate the in memory data base with persistent stored data.
	netDB.open = function(callback) {
		localforage.getItem('NetworkStatsDB', function(value) {
			if (value === null) {
				netStatsDB.data = [];
				if (typeof callback === "function"){
			    	callback(netStatsDB.errorCodes.DATABASE_EMPTY);
			    }
			} else {
				netStatsDB.data = value.stats;
				netStatsDB.queueSize = value.queueSize;
				if (typeof callback === "function"){
			    	callback(netStatsDB.SUCCESS);
			    }
			}
		});
	};
	
	
	// Saves current data to persistent storage. 
	netDB.save = function(callback) {
		var db = {stats:netDB.data, queueSize:this.queueSize};
		localforage.setItem('NetworkStatsDB', db, function(value) {
			if (typeof callback === "function"){
		    	callback(netStatsDB.SUCCESS);
		    }
		});
	};
	
	
	// Saves current data to persistent storage and clears data from memory.
	netDB.close = function(callback) {
		this.save(function(value) {
			netDB.data = [];
			if (typeof callback === "function"){
		    	callback(netStatsDB.SUCCESS);
		    }
		});
	};
	
	
	// Removes all data from persistent storage and clears in memory data.
	netDB.clear = function(callback) {
		localforage.removeItem('NetworkStatsDB', function() {
			netDB.data = [];
			console.log('Data base is cleared!');
		    if (typeof callback === "function"){
		    	callback(netStatsDB.SUCCESS);
		    }
		    
		});
	};
	
	
	/* 
	 * **************************************************************************************
	 * 	    SYCHRONOUS METHODS
	 * **************************************************************************************
	 */
	
	
	// Adds record to in memory data base. Does not save it to persistent storage.
	// See generateFakeDays() for example usage and data structure of a record. 
	netDB.addRecord = function(key, record) {
		var Records = this.data[key] || [];

		Records.push(record);
		
		while (Records.length > this.queueSize) {
			Records.shift();
		}
		
		this.data[key] = Records;		
	};
	
	
	// Sets the maximum number of weeks of data held for each record/data-point.
	// Default is 4 weeks.
	// Param  size:Integer
	netDB.setQueueSize = function(size) {
		if (typeof size == "number") {
			this.queueSize = Math.floor(size);   // force size to be an Integer.
		}
	};
	
	
	// Used to get network statistic records for current day or day passed in.
	// Param day:Integer.  Range: 0-6  Represents day of the week.
	// Returns: Array of records for the day.
	netDB.getRecordsDay = function(day) {
		day = Math.floor(day) || new Date().getDay();
		
		var returnData = [];
		var key = null;
		
		// check if 'day' matches first element of 'key'.
		for (key in this.data) {
			if (key.split(" ")[0] == day) {
				returnData.push(this.data[key]);
			}
		}
		
		return returnData;
	};
	
	
	// return network object to global name space.
	return netDB;
}());





