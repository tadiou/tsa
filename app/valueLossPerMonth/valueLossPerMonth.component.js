'use strict';

angular.module('valueLossPerMonth')
  .component('valueLossPerMonth', {
    templateUrl: 'app/valueLossPerMonth/valueLossPerMonth.html',
    controller: ('valueLossPerMonthnController', ['$scope', '$timeout', '$window', 'graph', 'fileReader', function($scope, $timeout, $window, graph, fileReader) {
      //Initialize month variables

      //Initialize month variables
      $scope.fromDate = new Date('January 1, 2010 03:24:00');
      $scope.toDate = new Date('December 1, 2013 03:24:00');

      $scope.update = function() {
        $scope.listOfSeriesNames = graph.getListOfSeriesNames();
        $scope.labels = graph.getLabels();
        $scope.series = graph.getSeries();
        $scope.data = graph.getData();
        $scope.totalValLoss = graph.calcTotal();
      }

      $scope.update();

      //Set series type
      $scope.seriesType = 'airline';

      //Stat variables
      $scope.lastClaimEntered = "N/A";

      $scope.rawData = graph.rawData;

      $timeout( function() {
        graph.findAverage($scope.seriesType)
      }, 500)

      $scope.updateSeries = function() {
          graph.updateSeries($scope.selectedSeries, $scope.seriesType, $scope.fromDate, $scope.toDate)
          $scope.update();
      }

      $scope.addClaim = function() {
        graph.addClaim($scope.claimInputDate, $scope.inputClaim, $scope.inputCost)
        graph.updateSeries($scope.selectedSeries, $scope.seriesType, $scope.fromDate, $scope.toDate)
        $scope.update();
      }
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



  }])
})
