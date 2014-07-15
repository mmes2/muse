  var con1 = document.getElementById('con1');
  var con2 = document.getElementById('con2');
  var con3 = document.getElementById('con3');
  var con4 = document.getElementById('con4');
  var con5 = document.getElementById('con5');
  var cr1 = document.getElementById('cr1');
  var cr2 = document.getElementById('cr2');
  var cr3 = document.getElementById('cr3');
  var cr4 = document.getElementById('cr4');
  var cr5 = document.getElementById('cr5');
  var cr6 = document.getElementById('cr6');
  var cr7 = document.getElementById('cr7');
  var cr8 = document.getElementById('cr8');

//Add one collection record at a time
//Used in networkDataCollector and generateFakeDay function at bottom of this file
function addRecord(record){
  getRecordList(record.Interval, function(recordList) {


    //If recordList doesn't exist, make a stub
    //else, cycle records back, removing oldest.    
    if(!recordList){
      console.log("no record list");
      recordList = {WebStat01: null, WebStat02: null,WebStat03: null,WebStat04: null, };
    }else{
      recordList = {WebStat04: recordList.WebStat03, 
                    WebStat03: recordList.WebStat02,
                    WebStat02: recordList.WebStat01,
                    WebStat01: {} };
    }

    //Create a WebStat object. Each contains two objects, WebStatSample and NetworkInfo    
    recordList.WebStat01 = { WebStatSample: 
                             {
                              CollectionDate:record.CollectionDate,
                              Latitude:record.Latitude,
                              Longitude:record.Longitude,
                             }, 
                             NetworkInfo: 
                             {
                              Network:record.ConnectionType,
                              Metered:false,
                              Bandwidth:record.Bandwidth,
                              SignalStrength:record.SignalStrength,
                              DataRecieved:record.DataRecieved,
                              DataSent:record.DataSent
                            }
                           };
    localforage.setItem(record.Interval, recordList, function(){});
    });
}

//Example on how to collect data from getRecordsDay. Something like this will
//be used in networkAnalysis
function printDay(day){
    var str = "";

    getRecordsDay(day, function(recordList) {
      if(recordList.WebStat01!= null){
        str = ("1: " +
        recordList.WebStat01.WebStatSample.CollectionDate + ": " 
        + recordList.WebStat01.NetworkInfo.Network);
      }
      if(recordList.WebStat02  != null){
      console.log("webstat02 exists!!");
        str += (" , 2: " +  
        recordList.WebStat02.WebStatSample.CollectionDate + ": " 
        + recordList.WebStat02.NetworkInfo.Network);
      }
      if(recordList.WebStat03 != null) {        
        str += (" , 3: " +
        recordList.WebStat03.WebStatSample.CollectionDate + ": " 
        + recordList.WebStat03.NetworkInfo.Network);
      }
      if(recordList.WebStat04 != null) {       
        str += (" , 4: " +
        recordList.WebStat04.WebStatSample.CollectionDate + ": " 
        + recordList.WebStat04.NetworkInfo.Network );        
      }

      console.log("[ " + str + "]");
    });
}


//Get a recordList = {WebStat01, WebStat02, WebStat03, WebStat04 } out of database
//by key value. Will probably not need to be used outside this file
function getRecordList(key, callback) {
  localforage.getItem(key, callback);
}

//Get, one recordList at a time, all the recordLists objects that are associated
//with a supplied day of the week. Can get current day like so:
//var d = new Date();
//var day = d.getDay();
//or just plug one in for testing. Will be used in networkAnalysis

function getRecordsDay(day,callback) {

  localforage.keys(function(keys) {
    var matches = [];
    con4.innerHTML = "keys: " + keys;
    keys.forEach(function (key) {
      if(day==key[0])
        matches.push(key);
    });
    con5.innerHTML = "keyMatches: " +matches;

    matches.forEach(function (key) {
      getRecordList(key, function(record) { 
        callback(record);
      });
    });
    

  });
}

//Room for improvement here!
function generateFakeDay(month, date){
  //localforage.clear(function(){});
  var fakeRecord;
  var d = new Date();
  d.setHours(9);
  d.setMinutes(0);
  d.setMonth(month);
  d.setDate(date);
  day = d.getDay();


  for(i = 0; d.getHours()<10; d.setTime(d.getTime() + 900000)) {
    fakeRecord = { Interval: day + " " + d.getHours() + ":" + d.getMinutes(),
                   Name: "linksys",
                   CollectionDate: new Date(d.getTime()),
                   ConnectionType: "mobile", 
                   Metered: false, 
                   Bandwidth: 2939, 
                   SignalStrength: 25, 
                   DataRecieved: 444, 
                   DataSent: 535,
                   Longitude:111,
                   Latitude:222
                 };
    addRecord(fakeRecord); 
  }


}
