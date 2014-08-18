var tryTomorrow = (function() { 

  var trytomorrow = {};

  trytomorrow.activate = function () {
    var alarmId;
    
    var d = new Date();
    d.setHours(0);
    d.setMinutes(5);
    d.setDate(d.getDate() + 1); //This puts us at 12:05 tonight

    var alarm = navigator.mozAlarms.add(d, "ignoreTimezone", {});

    alarm.onsuccess = function () {
      console.log("Running analysis again at: " + d.toString());
      alarmId = this.result;
      
    };
	
    alarm.onerror = function () {
      console.log("Unable to schedule fetcher: " + this.error.name);
      
    };

    navigator.mozSetMessageHandler("alarm", function (alarm) {
      if (alarmId) {
        navigator.mozAlarms.remove(alarmId);
        navigator.mozAlarms.remove(alarm.id);
      }
      
      services.start();
      
    });


  };

  return trytomorrow;

}());
