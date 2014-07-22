/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:        networkAnalysis.js
* @ Author:      Randal Holmes   
* @ Date:         2014-07-21
* @ Version:     0.1
* @ Copyright:    Copyright(C) Randal Holmes. MPL 2.0
*
*
* Description:    Analyses network statistics contains in networkDatabase.js and 
* 				  determines the best times for fetching data from the Internet.
*
*
*/

// setup global name space.
var Muse = Muse || {};

// setup network analysis object
Muse.NetStats = Muse.NetStats || function() {
	"use strict";
		
	var netstats = {};
	netstats.ready = false; // Indicates whether NetStats is fully initialized.
	
	// Initialization function
	// Returns: Error codes. 0 = Success
	netstats.init = function(onReadyCallback) {
		this.onReadyCallback = onReadyCallback || null;
		

		
		// To Do:  write init code.
		
		return 0;
	};
	
	
	// Function for getting the next best time to try downloading data from the Internet.
	// Returns: Date object.  
	netstats.nextBestDate = function() {
		
		return new Date();
		
	};
	
	return netstats;
	
}();






