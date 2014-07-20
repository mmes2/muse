//We need to clarify/understand what network analysis will be returning here, a single date, or an actual window?
var fetch_date = nextBestWindow();
/*https://developer.mozilla.org/en-US/docs/Web/API/Alarm_API 
need to include permissions and messages entries into the manifest.webapp in order for this functionality to work. 
we'll also need to discuss timezones etc... 
*/
var alarm_request = navigator.mozAlarms.add(fetch_date, "ignoreTimezone");
alarm_request.onsuccess = function () {
	console.log("alarm was scheduled for" + fetch_date);
};

alarm_request.onerror = function () {
	console.log("Unable to schedule alarm: " + this.error.name);
}

navigator.mozSetMessageHandler("fetcher_alarm", function (mozAlarm) {
	//check with network analysis to see if we can actually fetch stories
	if (currentlyFetchable()) {
		//call the fetcher
		go();
	} else {
		//if this ends up being a bad time then we need to re-schedule(possible to get caught in a loop with the network analysis tool here? how should we deal with this?)
		fetch_date = nextBestFetch();
		alarm_request = navigator.mozAlarms.add(fetch_date, "ignoreTimezone");
		alarm_request.onsuccess = function () {
			console.log("alarm was scheduled for" + fetch_date);
		};
		alarm_request.onerror = function () {
			console.log("Unable to schedule alarm: " + this.error.name);
		}
});
