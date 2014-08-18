

var fetcherAnalysis = (function() {
  
	
	var fetchAnalysis = {};
	
	fetchAnalysis.wifiCollectionTimes = [];
	fetchAnalysis.mobileCollectionTimes = [];

	fetchAnalysis.analyser = {
		// Date that the analysis was run for. 
		date:null,

		///Helper functions to filter out unusable collection times ///
		futureTime:function(element){
				return element.Time.getTime() >= (new Date()).getTime();
		},
		
		//TODO: replace these magic numbers with constants, confirm #'s for b/s and link speed
		goodWifiLinkSpeed:function(element){
			return element.avgWifiLinkSpeed >= 4;
		},
		goodWifiBytesPerSecond:function(element){
			return element.avgWifiBytesPerSecond >= 200 && element.avgWifiBytesPerSecond <= 30000;
		},
		goodWifiSignalStrength:function(element){
			return element.avgWifiSignalStrength >= 25;
		},
		goodMobileBytesPerSecond:function(element){
			return element.avgMobileBytesPerSecond >= 100 && element.avgMobileBytesPerSecond <= 10000;
		},
		goodMobileSignalStrength:function(element){
			return element.avgMobileSignalStrength >= 25;
		},
		
		//Remove mobileCollectionTimes that are also in wifiCollectionTimes
		//This needs more testing to show it works
		notInWifiTimes:function(element){
			return element;
			
			/*var notIn = true;
			
			netStats.wifiCollectionTimes.forEach(wifiTime) {
				if(element.Time === wifiTime.Time){
					notIn = false;
				}
			};
			
			return notIn;*/
		},		
		
		//Second shot at a runAnalysis function
		//Checks data sent/rec, signal strength, link speed on wifi connections.
		//updates netstats.wifiCollectionTimes and netstats.mobileConnection times with usable times

		runAnalysis:function(date){
			this.date = date || new Date();
			var todayStats = netStatsDB.getRecordsDay(this.date.getDay());  // get records for today.
			//var todayStats = netStatsDB.getRecordsDay(3);  // testing!
			var collectionTimes = [];
      
			todayStats.forEach(function (interval){
       
				var weeks = interval.length;
				
				var avgStat = {};	
				avgStat.avgWifiBytesPerSecond = 0;
				avgStat.avgWifiLinkSpeed = 0;
				avgStat.avgWifiSignalStrength = 0;
				avgStat.avgMobileBytesPerSecond = 0;
				avgStat.avgMobileSignalStrength = 0;
				avgStat.Time = new Date();
				
				fetcherAnalysis.wifiCollectionTimes = [];
				fetcherAnalysis.mobileCollectionTimes = [];
			  
				if(interval[0]){
					avgStat.Time.setHours(interval[0].End.getHours());
					avgStat.Time.setMinutes(interval[0].End.getMinutes());
					avgStat.Time.setSeconds(0);
				}else{
					console.log("corrupted database!!!");
					//There was a key which held an empty list, this should never happen!
				}
			
				var totalSeconds = 0;	
			
				interval.forEach(function (stat){
					totalSeconds += (stat.End.getTime() - stat.Start.getTime()) / 1000;  //ms to seconds
					
					if(stat.Wifi.Connected){
					
						avgStat.avgWifiBytesPerSecond += stat.Wifi.DataReceived + stat.Wifi.DataSent;
						avgStat.avgWifiLinkSpeed += stat.Wifi.Bandwidth;
						avgStat.avgWifiSignalStrength += stat.Wifi.SignalStrength;
					}
					
					if(stat.Mobile.Connected && !stat.Mobile.Metered && !stat.Mobile.Roaming){
						avgStat.avgMobileBytesPerSecond += stat.Mobile.DataReceived + stat.Mobile.DataSent;
						avgStat.avgMobileSignalStrength += stat.Mobile.SignalStrength;
					}
					
				});
			
				avgStat.avgWifiBytesPerSecond =  avgStat.avgWifiBytesPerSecond / totalSeconds;
				avgStat.avgWifiLinkSpeed = avgStat.avgWifiLinkSpeed / weeks;
				avgStat.avgWifiSignalStrength = avgStat.avgWifiSignalStrength / weeks;
				
				avgStat.avgMobileBytesPerSecond = avgStat.avgMobileBytesPerSecond / totalSeconds;
				avgStat.avgMobileSignalStrength = avgStat.avgMobileSignalStrength / weeks;
				
				collectionTimes.push(avgStat);
			});		
			
			///Filter out unusable collection times ///
			fetcherAnalysis.wifiCollectionTimes = collectionTimes.filter(this.futureTime);
			fetcherAnalysis.wifiCollectionTimes = fetcherAnalysis.wifiCollectionTimes.filter(this.goodWifiLinkSpeed);
			fetcherAnalysis.wifiCollectionTimes = fetcherAnalysis.wifiCollectionTimes.filter(this.goodWifiBytesPerSecond);
			fetcherAnalysis.wifiCollectionTimes = fetcherAnalysis.wifiCollectionTimes.filter(this.goodWifiSignalStrength);
			
			fetcherAnalysis.mobileCollectionTimes = collectionTimes.filter(this.futureTime);
			fetcherAnalysis.mobileCollectionTimes = fetcherAnalysis.mobileCollectionTimes.filter(this.notInWifiTimes); 
			fetcherAnalysis.mobileCollectionTimes = fetcherAnalysis.mobileCollectionTimes.filter(this.goodMobileBytesPerSecond);
			fetcherAnalysis.mobileCollectionTimes = fetcherAnalysis.mobileCollectionTimes.filter(this.goodMobileSignalStrength);
		
		}
	};





	fetchAnalysis.nextBestDate = function() {
                var oneHour = 3600000;
		var rightNow = new Date();
		var bestIndex = 0;
		var bestLinkSpeed = 0;		
		var bestSS = 0;	
		var todaysWifiTimes = fetcherAnalysis.wifiCollectionTimes.filter(fetcherAnalysis.analyser.futureTime);
		var todaysMobileTimes;
		
		//Helper function: nextHour
		//Argument: List of future times
		//Returns: List of collection times within next hour
		var nextHour = function (times){
		  var nextTime = [];
			
			if(times.length !==0){
				times.forEach(function (element) {
					if(element.Time.getTime() < (rightNow.getTime() + oneHour)){
						nextTime.push(element); 
					}else{
						return nextTime;
					}
				});
			}
			  
			return nextTime;
		};
		
		//First try to find the best wifi collection time within the next hour
		var nextWifi = nextHour(todaysWifiTimes);
	
		if(nextWifi.length > 0){
		
			nextWifi.forEach(function (element, i){
				if(element.avgWifiLinkSpeed > bestLinkSpeed){
					bestIndex = i;
					bestLinkSpeed = element.avgWifiLinkSpeed;
				}
			});
			console.log("Wifi time within hour: " + nextWifi[bestIndex].Time);
			return {date:nextWifi[bestIndex].Time, error:netStats.SUCCESS};
			
		}else{
			//No wifi times within hour, find best mobile time within hour
			todaysMobileTimes = fetcherAnalysis.mobileCollectionTimes.filter(fetcherAnalysis.analyser.futureTime);	
			var nextMobile = nextHour(todaysMobileTimes);
			
			if(nextMobile.length > 0){
				
				nextMobile.forEach(function (element, i){
					if(element.avgMobileSignalStrength > bestSS){
						bestIndex = i;
						bestSS = element.avgMobileSignalStrength;
					}
				});

				console.log("Mobile time within hour: " + nextMobile[bestIndex].Time);
				return {date:nextMobile[bestIndex].Time, error:netStats.SUCCESS};
				
			}else {
				//No mobile or wifi times within hour, finding next usable wifi time
				if(todaysWifiTimes.length !== 0){
					console.log("No connection times within hour, next wifi time is: " + todaysWifiTimes[0].Time);
					return {date:todaysWifiTimes[0].Time, error:netStats.SUCCESS};
				}else if(todaysMobileTimes.length !== 0){
					//No wifi times today, find next mobile time today
					console.log("No wifi times today, next mobile is: " + todaysMobileTimes[0].Time);
					return {date:todaysMobileTimes[0].Time, error:netStats.SUCCESS};
				}else{
					//There are no more usable times today
					console.log("NO TIMES TODAY!");
					return {date:null, error:netStats.errorCodes.NO_GOOD_CONNECTION_TIME_TODAY};
					//TODO: find next usable time tomorrow unless database empty (inf loop if no usable times??)
					//Better: services sets alarm for tomorrow, calls runAnalysis, asks for nextBestTime again
				}		
			}
		}
	};


   
  return fetchAnalysis;
	
}());

