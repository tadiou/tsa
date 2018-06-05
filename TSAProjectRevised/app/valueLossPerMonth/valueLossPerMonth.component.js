'use strict';

angular.module('valueLossPerMonth')
  .component('valueLossPerMonth', {
    templateUrl: 'app/valueLossPerMonth/valueLossPerMonth.html',
    controller: ('valueLossPerMonthnController', ['$scope', '$window', function($scope, $window) {
      //Initialize month variables
      $scope.fromMonth = new Date('January 1, 2010 03:24:00');
  		$scope.toMonth = new Date('December 1, 2013 03:24:00');

      //Stat variables
      $scope.lastClaimEntered = "N/A"

      //Set series type
      $scope.seriesType = 'airline';

      //Collect list of series names (airlines or airports)
      $scope.listOfSeriesNames = [];

      //Labels
      $scope.labels = ['Jan10', "Feb10", "Mar10", "Apr10", "May10", "Jun10", "Jul10", "Aug10", "Sep10", "Oct10", "Nov10", "Dec10",
  		"Jan11", "Feb11", "Mar11", "Apr11", "May11", "Jun11", "Jul11", "Aug11", "Sep11", "Oct11", "Nov11", "Dec11",
  		"Jan12", "Feb12", "Mar12", "Apr12", "May12", "Jun12", "Jul12", "Aug12", "Sep12", "Oct12", "Nov12", "Dec12",
  		"Jan13", "Feb13", "Mar13", "Apr13", "May13", "Jun13", "Jul13", "Aug13", "Sep13", "Oct13", "Nov13", "Dec13"];

      //Series
      $scope.series = [];

      //Data
      $scope.data = [];

      //Options
      $scope.options = {
		    scales: {
		      yAxes: [
		        {
		          id: 'y-axis-1',
		          type: 'linear',
		          display: true,
		          position: 'left',
							scaleLabel: {
								display: true,
								labelString: "Value Loss Per Month in $"
							}
		        }],
					xAxes: [
						{
							id: 'x-axis-1',
							scaleLabel: {
								display: true,
								labelString: "2010-2013 In Months"
							}

					}],
		  	},
				title: {
						display: true,
						text: 'TSA Data 2010-2013 Value Loss Per Month',
						position: 'top'
				}
		};

    var years = [2010, 2011, 2012, 2013];										//Array for building object
		var months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];		//Array for building object

    //Build an object to store raw data in
    var yearMonthStructure = function() {
			var structure = {}
			years.forEach(function(year) {
				months.forEach(function(month) {
					structure[year] = structure[year] || {};
					structure[year][month] = [];
				})
			});
			return structure;
		}

    //Convert my number string to an integer
		function convertDollarToInteger(dollar) {
			return Number(dollar.replace(/[^0-9\.-]+/g,""));
		}

    $scope.totalValLoss = 0

    var calcTotalValLoss = function() {

        $scope.totalValLoss = 0;

        $scope.data.forEach(function(data, index) {

            //Don't add the averages!
            if (index !== 0)
            {
                $scope.totalValLoss += data.reduce((total, amount) => total + amount);
            }
        })

        $scope.totalValLoss = $scope.totalValLoss.toFixed(2);
    }

    $scope.add = function() {
      var month = $scope.claimInputDate.getMonth();
      var year = $scope.claimInputDate.getFullYear();

      var pushObj = {
        airline: $scope.inputClaim.trim(),
        value: $scope.inputCost,
        airport: "N/A"
      }

      $scope.lastClaimEntered = $scope.inputClaim.trim() + " " + month + "/" + year + " $" + $scope.inputCost;

      $scope.rawData[year][month].push(pushObj)

      $scope.addSeries();
    }
    //Scope function to adjust timeWindow (attached to month filters)
    $scope.timeWindow = function() {

      //Reset lablels
      $scope.labels = ['Jan10', "Feb10", "Mar10", "Apr10", "May10", "Jun10", "Jul10", "Aug10", "Sep10", "Oct10", "Nov10", "Dec10",
  		"Jan11", "Feb11", "Mar11", "Apr11", "May11", "Jun11", "Jul11", "Aug11", "Sep11", "Oct11", "Nov11", "Dec11",
  		"Jan12", "Feb12", "Mar12", "Apr12", "May12", "Jun12", "Jul12", "Aug12", "Sep12", "Oct12", "Nov12", "Dec12",
  		"Jan13", "Feb13", "Mar13", "Apr13", "May13", "Jun13", "Jul13", "Aug13", "Sep13", "Oct13", "Nov13", "Dec13"];

      //Convert from month to month and year
      var fromMonth = $scope.fromMonth.getMonth();
      var fromYear = $scope.fromMonth.getFullYear();

      //Calculate starting index
      var beginIndex = (fromYear % 10 * 12) + fromMonth;

      //Repeat with toMonth
      var toMonth = $scope.toMonth.getMonth();
      var toYear = $scope.toMonth.getFullYear();

      //Calculate endIndex
      var endIndex = (toYear % 10 * 12) + toMonth;

      //Slice labels and data
      $scope.labels = $scope.labels.slice(beginIndex, endIndex + 1);
      $scope.data.forEach(function(dataSeries, index) {
          $scope.data[index] = dataSeries.slice(beginIndex, endIndex + 1)
      })
    }

    //Add one or more series to the series and data variables
    $scope.addSeries = function() {

      //Empty series and data scope variables
      $scope.series = [];
      $scope.data = [];

      //Initialize average
      findAverage();

      //For each series selected in the select multiple box.
      //Check for undefined
      if($scope.selectedSeries !== undefined) {
          $scope.selectedSeries.forEach(function(series, index) {

            //Create an array that will be input into scope data
            var inputArray = new Array(48).fill(0);

            //Push the series name into the series
            $scope.series.push(series);

            //Loop through the whole thing. Per YearMonth filter out all the entries
            //with the same series(airline or airport). For each object in the new
            //filter array sum add the object value to the appropraite array slot
            for (var i = 2010; i < 2014; i++) {
              for (var j = 0; j < 12; j++) {
                var filter = $scope.rawData[i][j].filter(function(entry){
                    return entry[$scope.seriesType] == series.trim();
                })
                filter.forEach(function(obj, index) {
                  inputArray[(i % 10 * 12) + j] += obj.value;
                })
              }
            }

            //Push the input array
            $scope.data.push(inputArray);
          })
        }

      //Calculate the total value loss
      calcTotalValLoss();

      //Run timeWindow
      $scope.timeWindow();
    }

    //Calculate average
    function findAverage() {

      //Add average to the series
      $scope.series.push('Average');

      //Create a new array for the averages
      var avgArray = new Array(48).fill(0)

      //Loop through the whole raw data object
      Object.entries($scope.rawData).forEach(function(year, yearIndex) {
        Object.entries(year[1]).forEach(function(month, monthIndex) {
            Object.entries(month[1]).forEach(function(entry, entryIndex) {

              //Get year in months
              var yearInMonths = parseInt(year[0]) % 10 * 12;

              //Get months
              var months = parseInt(month[0]);

              //Put val if statement for seriestype here
              //Get the value associated with the entry
              var val = parseInt(entry[1]['value'])

              //Add it to the appropriate array slot
              avgArray[yearInMonths + months] += val;

              //If the series name isn't in the my scope variable add it!
              if (!$scope.listOfSeriesNames.includes(entry[1][$scope.seriesType]))
              {
                  $scope.listOfSeriesNames.push(entry[1][$scope.seriesType])
              }
          })
        })
      })


      //Calculate averages once I have all of the series names in rawData
      avgArray.forEach(function(total, totalIndex) {
        avgArray[totalIndex] = total / $scope.listOfSeriesNames.length;
      });

      //Push it! No need to do timeWindow. This only runs by itself on start
      $scope.data.push(avgArray);

    }

    //Create a structure for rawData
    $scope.rawData = yearMonthStructure();

    //Use papaParse!
    $window.Papa.parse("data/claims.csv", {
      download: true,
      header: true,
      fastmode: true,
      //Streaming function
      step: function(results, parser) {

          var data = results.data[0];               //Data object
          var d = new Date(data['IncidentDate'])    //Get the date
          var month = d.getMonth();                 //Get the date's month
          var year = d.getFullYear();               //Get the date's full year
          var value = 0;                            //Initialize value to zero

          //Create a conditional in case their are empty lines
          if (data['CloseAmount'] !== undefined)
          {
            //If there's not a hypen, convert to integer
            if (data['CloseAmount'] !== '-')
            {
                value = convertDollarToInteger(data['CloseAmount']);
            }

            //Create a push object with all neccessary info
            var pushObj = {
              airline: data['AirlineName'].trim(),
              value: value,
              airport: data['AirportCode']
            }

            //Push object into rawData
            $scope.rawData[year][month].push(pushObj);
          }
      },
      //When the parsing is done
      complete: function() {

          //Run find average to start
          findAverage();

          //Apply
          $scope.$apply();
      }
    });
  }])
})
