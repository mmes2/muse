/* 
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* @ File:        genFakeMonth.js
* @ Author:      Mike Kuvelas     * 
* 
* Description:    When run, 28 days of collection data will be added to 
*                 the network database
* 
* 
*/

var fakeMonth = (function () {
	"use strict";
	
	var startDate = new Date();   //Monday September 1st @ 9:00am
	var endDate = new Date();
	
	var data0 = 0;
	var data1 = 100;
	var data2 = 400;
	var data3 = 2000;
	var data4 = 10000;
	var data5 = 50000;
	var data6 = 100000;
	var data7 = 500000;
	var data8 = 2000000;
	var data9 = 6000000;
	
	var signal0 = 0;
	
	var link0 = 0;
	
	
	var generator = {};
	
	generator.generateFakeMonth = function(){

		var timeDelta = 60 * 15 * 1000;  // seconds, minutes, milliseconds: Time between data entries in milliseconds.

		var add = function (record) {
			netStatsDB.addRecord(record[0], { 
					 "Start": record[1],
					 "End": record[2],
					 "Latitude":record[3],
					 "Longitude":record[4],

					 "Wifi":{
						 "Connected":record[5],
						 "NetworkName":record[6], 
						 "Bandwidth":record[7], 
						 "SignalStrength":record[8],
						 "DataReceived":record[9],
						 "DataSent":record[10]     
					 },
				Mobile:{
					"Connected":record[11],		
					"NetworkName":record[12],
					"Bandwidth":record[13],
					"SignalStrength":record[14],
					"DataReceived":record[15],
					"DataSent":record[16],
					"Roaming":record[17],
					"Metered":record[18]
				}
			});
		};
		
		
		
		
		
		
		var setSunday = function (){
			//Sunday (0) - 9am - 5pm
			//starts low data sent/recieved, peaks around noon, slow decline until collection stops
			//no change in other data members
			
			add(["0 9:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 9:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 9:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 9:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 10:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 10:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 10:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 10:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 11:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 11:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 11:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 11:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 12:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 12:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 12:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 12:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 13:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 13:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 13:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 13:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 14:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 14:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 14:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 14:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 15:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 15:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 15:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 15:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 16:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 16:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 16:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 16:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["0 17:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
		};
		
		
		var setMonday = function () {
			//Monday (1)
			//9am-5pm, with 10am up to 1pm (not including) times missing
			startDate.setHours(8);
			startDate.setMinutes(56);
			endDate.setHours(8);
			endDate.setMinutes(0);


			add(["1 9:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 9:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 9:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 9:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);


			///missing 10am - 1pm

			startDate.setHours(12);
			startDate.setMinutes(51); //12:51 is when collection resumed, real life condition of networkDataCollector
			endDate.setHours(13);
			endDate.setMinutes(0);

			add(["1 13:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 13:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 13:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 13:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 14:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 14:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 14:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 14:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 15:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 15:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 15:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 15:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 16:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data0, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 16:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data0, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 16:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 16:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["1 17:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
		};
		
		//Tuesday (2)
		var setTuesday = function () {
			
			startDate.setHours(8);
			startDate.setMinutes(54);
			endDate.setHours(9);
		  endDate.setMinutes(0);		


			add(["2 9:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 9:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 9:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 9:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 10:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 10:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 10:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data7, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 10:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 11:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 11:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 11:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 11:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 12:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 12:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 12:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 12:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 13:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 13:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 13:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 13:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 14:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data7, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 14:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 14:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 14:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 15:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 15:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 15:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 15:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 16:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 16:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data8, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 16:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 16:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["2 17:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
		};
		
	
		var setWednesday = function (){
			//Wednesday (3) - 9am - 1pm
			//starts low data sent/recieved, peaks around noon, sharp cut off at 1pm
			//no change in other data members
			
			startDate.setHours(8);
			startDate.setMinutes(59);
			endDate.setHours(9);
			endDate.setMinutes(0);
			
			add(["3 9:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 9:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 9:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data2, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 9:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 10:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data3, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 10:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data4, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 10:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data5, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 10:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 11:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 11:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data6, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 11:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data7, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 11:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data7, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 12:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data8, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 12:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data8, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 12:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data9, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 12:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data8, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["3 13:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data8, false,null,null,null,null,null,null,null]);
			
		};

		var setThrusday = function (){
			//Thursday (4) - 9am - 12pm, 7:15pm - 9:00pm
			startDate.setHours(8);
			startDate.setMinutes(57);
			endDate.setHours(9);
			endDate.setMinutes(0);
			
			add(["4 9:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 9:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 9:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 9:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 10:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 10:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 10:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 10:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 11:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 11:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 11:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 11:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 12:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			startDate.setHours(19);
			startDate.setMinutes(11);
			endDate.setHours(19);
			endDate.setMinutes(15);
			add(["4 19:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 19:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 19:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 20:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 20:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 20:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 20:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["4 21:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			
			
		};
		var setFriday = function (){
			//Friday (5) - 10am-10:45, 11:00-12:15pm, 1:45-3:45, 5:00, 9:00-11:45
			startDate.setHours(9);
			startDate.setMinutes(58);
			endDate.setHours(10);
			endDate.setMinutes(0);
			
			add(["5 10:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 10:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 10:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 10:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			startDate.setHours(11);
			startDate.setMinutes(11);
			endDate.setHours(11);
			endDate.setMinutes(30);
			
			add(["5 11:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 11:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 12:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 12:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			
			startDate.setHours(13);
			startDate.setMinutes(31);
			endDate.setHours(13);
			endDate.setMinutes(45);
			
			add(["5 13:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 14:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 14:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 14:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 14:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 15:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 15:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 15:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 15:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			
			startDate.setHours(16);
			startDate.setMinutes(52);
			endDate.setHours(17);
			endDate.setMinutes(0);
			
			add(["5 17:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			startDate.setHours(20);
			startDate.setMinutes(45);
			endDate.setHours(21);
			endDate.setMinutes(0);
			
			add(["5 21:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 21:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 21:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 21:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			add(["5 22:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 22:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 22:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 22:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			add(["5 23:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 23:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 23:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["5 23:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);

		};
		var setSaturday = function (){
			//Saturday (6) 12:00am - 1:15am, 3pm-4:15pm
			
			startDate.setHours(23);
			startDate.setMinutes(45);
			startDate.setDate(5);
			
			endDate.setHours(0);
			endDate.setMinutes(0);
			
			add(["6 0:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 0:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 0:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 0:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			add(["6 1:0",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 1:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
			startDate.setHours(14);
			startDate.setMinutes(59);
			endDate.setHours(15);
			endDate.setMinutes(0);
			
			
			add(["6 15:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 15:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 15:30",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 15:45",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			add(["6 16:00",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			startDate.setTime(endDate.getTime());
			endDate.setTime(startDate.getTime() + timeDelta);
			add(["6 16:15",startDate, endDate, "00000", "00000",true, "linksys", link0, signal0, data1, data1, false,null,null,null,null,null,null,null]);
			
		};
		
		////////////////////////////////////////////////
		startDate.setMonth(9);
		startDate.setDate(1);		
		endDate.setMonth(9);
		endDate.setDate(1);


		setMonday();
		startDate.setDate(2);
		endDate = new Date(startDate.getTime() + timeDelta);
		setTuesday();
		startDate.setDate(3);
		endDate = new Date(startDate.getTime() + timeDelta);
		setWednesday();
		startDate.setDate(4);
		endDate = new Date(startDate.getTime() + timeDelta);
		setThrusday();
		startDate.setDate(5);
		endDate = new Date(startDate.getTime() + timeDelta);
		setFriday();
		startDate.setDate(6);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSaturday();
		startDate.setDate(7);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSunday();
		startDate.setDate(8);
		endDate = new Date(startDate.getTime() + timeDelta);
		setMonday();
		startDate.setDate(9);
		endDate = new Date(startDate.getTime() + timeDelta);
		setTuesday();
		startDate.setDate(10);
		endDate = new Date(startDate.getTime() + timeDelta);
		setWednesday();
		startDate.setDate(11);
		endDate = new Date(startDate.getTime() + timeDelta);
		setThrusday();
		startDate.setDate(12);
		endDate = new Date(startDate.getTime() + timeDelta);
		setFriday();
		startDate.setDate(13);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSaturday();
		startDate.setDate(14);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSunday();
		startDate.setDate(15);
		endDate = new Date(startDate.getTime() + timeDelta);
		setMonday();
		startDate.setDate(16);
		endDate = new Date(startDate.getTime() + timeDelta);
		setTuesday();
		startDate.setDate(17);
		endDate = new Date(startDate.getTime() + timeDelta);
		setWednesday();
		startDate.setDate(18);
		endDate = new Date(startDate.getTime() + timeDelta);
		setThrusday();
		startDate.setDate(19);
		endDate = new Date(startDate.getTime() + timeDelta);
		setFriday();
		startDate.setDate(20);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSaturday();
		startDate.setDate(21);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSunday();
		startDate.setDate(22);
		endDate = new Date(startDate.getTime() + timeDelta);
		setMonday();
		startDate.setDate(23);
		endDate = new Date(startDate.getTime() + timeDelta);
		setTuesday();
		startDate.setDate(24);
		endDate = new Date(startDate.getTime() + timeDelta);
		setWednesday();
		startDate.setDate(25);
		endDate = new Date(startDate.getTime() + timeDelta);
		setThrusday();
		startDate.setDate(26);
		endDate = new Date(startDate.getTime() + timeDelta);
		setFriday();
		startDate.setDate(27);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSaturday();
		startDate.setDate(28);
		endDate = new Date(startDate.getTime() + timeDelta);
		setSunday();
		
	};
	
	return generator;

}());

fakeMonth.generateFakeMonth();
