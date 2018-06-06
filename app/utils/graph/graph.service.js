'use strict'

angular.module('graph')
  .factory('graph', ['fileReader', function(fileReader) {

    var labels = ['Jan10', "Feb10", "Mar10", "Apr10", "May10", "Jun10", "Jul10", "Aug10", "Sep10", "Oct10", "Nov10", "Dec10",
    "Jan11", "Feb11", "Mar11", "Apr11", "May11", "Jun11", "Jul11", "Aug11", "Sep11", "Oct11", "Nov11", "Dec11",
    "Jan12", "Feb12", "Mar12", "Apr12", "May12", "Jun12", "Jul12", "Aug12", "Sep12", "Oct12", "Nov12", "Dec12",
    "Jan13", "Feb13", "Mar13", "Apr13", "May13", "Jun13", "Jul13", "Aug13", "Sep13", "Oct13", "Nov13", "Dec13"];

    var getLabels = function() {
        return labels;
    }

    var series = [];

    var getSeries = function(){
      return series;
    };

    var listOfSeriesNames = [];

    var getListOfSeriesNames = function() {
      return listOfSeriesNames;
    }

    var data = []

    var getData = function() {
      return data;
    }

    var rawData = fileReader.rawData;

    //Calculate average
    function findAverage(seriesType) {

      //Add average to the series
      series.push('Average');

      //Create a new array for the averages
      var avgArray = new Array(48).fill(0)

      //Loop through the whole raw data object
      Object.entries(rawData).forEach(function(year, yearIndex) {
        Object.entries(year[1]).forEach(function(month, monthIndex) {
            Object.entries(month[1]).forEach(function(entry, entryIndex) {

              //Get year in months
              var yearInMonths = parseInt(year[0]) % 10 * 12;

              //Get months
              var months = parseInt(month[0]);

              // if (seriesType == 'airplane')
              // {
                  var val = parseInt(entry[1]['value']);
              // }
              // else if (seriesType == 'airport')
              // {
              //     var val = 1;
              // }
              //Put val if statement for seriestype here
              //Get the value associated with the entry

              //Add it to the appropriate array slot
              avgArray[yearInMonths + months] += val;

              //If the series name isn't in the my scope variable add it!
              if (!listOfSeriesNames.includes(entry[1][seriesType]))
              {
                  listOfSeriesNames.push(entry[1][seriesType])
              }
          })
        })
      })


      //Calculate averages once I have all of the series names in rawData
      avgArray.forEach(function(total, totalIndex) {
        avgArray[totalIndex] = total / listOfSeriesNames.length;
      });

      //Push it! No need to do timeWindow. This only runs by itself on start
      data.push(avgArray);

    }

    function timeWindow(fromDate, toDate){

      //Reset lablels
      labels = ['Jan10', "Feb10", "Mar10", "Apr10", "May10", "Jun10", "Jul10", "Aug10", "Sep10", "Oct10", "Nov10", "Dec10",
  		"Jan11", "Feb11", "Mar11", "Apr11", "May11", "Jun11", "Jul11", "Aug11", "Sep11", "Oct11", "Nov11", "Dec11",
  		"Jan12", "Feb12", "Mar12", "Apr12", "May12", "Jun12", "Jul12", "Aug12", "Sep12", "Oct12", "Nov12", "Dec12",
  		"Jan13", "Feb13", "Mar13", "Apr13", "May13", "Jun13", "Jul13", "Aug13", "Sep13", "Oct13", "Nov13", "Dec13"];

      //Convert from month to month and year
      var fromMonth = fromDate.getMonth();
      var fromYear = fromDate.getFullYear();

      //Calculate starting index
      var beginIndex = (fromYear % 10 * 12) + fromMonth;

      //Repeat with toMonth
      var toMonth = toDate.getMonth();
      var toYear = toDate.getFullYear();

      //Calculate endIndex
      var endIndex = (toYear % 10 * 12) + toMonth;

      //Slice labels and data
      labels = labels.slice(beginIndex, endIndex + 1);

      data.forEach(function(dataSeries, index) {
          data[index] = dataSeries.slice(beginIndex, endIndex + 1)
      })
    }

    //Add one or more series to the series and data variables
    function updateSeries(selectedSeries, seriesType, fromDate, toDate) {
      //Empty series and data scope variables
      console.log(fromDate);
      console.log(toDate);
      series = [];
      data = [];

      //Initialize average
      findAverage(rawData, seriesType);

      //For each series selected in the select multiple box.
      //Check for undefined
      if(selectedSeries !== undefined) {
          selectedSeries.forEach(function(mySeries, index) {

            //Create an array that will be input into scope data
            var inputArray = new Array(48).fill(0);

            //Push the series name into the series
            series.push(mySeries);

            //Loop through the whole thing. Per YearMonth filter out all the entries
            //with the same series(airline or airport). For each object in the new
            //filter array sum add the object value to the appropraite array slot
            for (var i = 2010; i < 2014; i++) {
              for (var j = 0; j < 12; j++) {
                var filter = rawData[i][j].filter(function(entry){
                    return entry[seriesType] == mySeries.trim();
                })
                filter.forEach(function(obj, index) {
                  inputArray[(i % 10 * 12) + j] += obj.value;
                })
              }
            }

            //Push the input array
            data.push(inputArray);
          })
        }

      //Calculate the total value loss
      // calcTotalValLoss();

      //Run timeWindow
      timeWindow(fromDate, toDate);
    }

    function addClaim(claimInputDate, inputClaim, inputCost) {

      console.log(claimInputDate);
      var month = claimInputDate.getMonth();
      var year = claimInputDate.getFullYear();

      var pushObj = {
        airline: inputClaim.trim(),
        value: inputCost,
        airport: "N/A"
      }

      // lastClaimEntered = inputClaim.trim() + " " + month + "/" + year + " $" + inputCost;

      rawData[year][month].push(pushObj)

    }



    return {
      getLabels: getLabels,
      getSeries: getSeries,
      getListOfSeriesNames: getListOfSeriesNames,
      getData: getData,
      findAverage: findAverage,
      updateSeries: updateSeries,
      addClaim: addClaim
    }
}])
