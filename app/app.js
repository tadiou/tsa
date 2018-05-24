angular.module('app', ["ng-fusioncharts"])
	.controller('ctrl', ['$scope', function($scope) {

		var years = [2010, 2011, 2012, 2013];
		var months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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

		$scope.rawData = {};

		$scope.graph1attrs = {
				"caption": "Avg Loss Per Month",
				"subCaption": "DICKS",
				"numberprefix": "$",
				"plotgradientcolor": "",
				"bgcolor": "FFFFFF",
				"showalternatehgridcolor": "0",
				"divlinecolor": "CCCCCC",
				"showvalues": "0",
				"showcanvasborder": "0"

		}

		$scope.graph1categories = [{
    "category": [{
        "label": "Jan 10"
    }, {
        "label": "Feb 10"
    }, {
        "label": "Mar 10"
    }, {
        "label": "Apr 10"
    }, {
        "label": "May 10"
    }, {
        "label": "Jun 10"
    }, {
        "label": "Jul 10"
    }, {
        "label": "Aug 10"
    }, {
        "label": "Sep 10"
    }, {
        "label": "Oct 10"
    }, {
        "label": "Nov 10"
    }, {
        "label": "Dec 10"
    }, {
        "label": "Jan 11"
    },{
        "label": "Feb 11"
    },{
        "label": "Mar 11"
    },{
        "label": "Apr 11"
    },{
        "label": "May 11"
    },{
        "label": "Jun 11"
    },{
        "label": "Jul 11"
    },{
        "label": "Aug 11"
    },{
        "label": "Sep 11"
    },{
        "label": "Oct 11"
    },{
        "label": "Nov 11"
    },{
        "label": "Dec 11"
    }, {
        "label": "Jan 12"
    },{
        "label": "Feb 12"
    },{
        "label": "Mar 12"
    },{
        "label": "Apr 12"
    },{
        "label": "May 12"
    },{
        "label": "Jun 12"
    },{
        "label": "Jul 12"
    },{
        "label": "Aug 12"
    },{
        "label": "Sep 12"
    },{
        "label": "Oct 12"
    },{
        "label": "Nov 12"
    },{
        "label": "Dec 12"
    }, {
        "label": "Jan 13"
    },{
        "label": "Feb 13"
    },{
        "label": "Mar 13"
    },{
        "label": "Apr 13"
    },{
        "label": "May 13"
    },{
        "label": "Jun 13"
    },{
        "label": "Jul 13"
    },{
        "label": "Aug 13"
    },{
        "label": "Sep 13"
    },{
        "label": "Oct 13"
    },{
        "label": "Nov 13"
    },{
        "label": "Dec 13"
    },]
}]

		$scope.graph1data = []

		var airportCodes = [];

		var graphObj = function() {
			var structure = {
				"seriesname": "What",
				"data": new Array()
			}
			return structure;
		}

		var valueObj = {
			"value" : 0
		}

		//Function to input csv data file
		function csvData(file) {
		  d3.csv(file, function(data, index) {
				captureRawData(data, index);
		  }).then(function(data) {

				Object.entries($scope.rawData).forEach(function(airline,value) {

						var pushObject = Object.assign({}, graphObj());

						pushObject["seriesname"] = airline[0]

						Object.entries(airline[1]).forEach(function(year, airline) {
								Object.entries(year[1]).forEach(function(month, year) {
										if (month[1] != undefined && month[1].length != 0) {
											var subObj = Object.assign({}, valueObj);
											var tempArray = [];
											subObj["value"] = month[1].reduce((total, amount) => total + amount);
											pushObject["data"].push(subObj);

										}
										else {
											var subObj = Object.assign({}, valueObj);
											subObj["value"] = 0;
											pushObject["data"].push(subObj);

										}

									});
						});
						debugger
						$scope.graph1data.push(pushObject)
					});



				// });
				//GETTING THE AIRLINE name
				// ***** Object.entries($scope.rawData).forEach((airline, value) => console.log(airline[0])) ***** //

				//GETTING THE YEAR AND THE MONTH
				// var obj = Object.entries($scope.rawData);
				// obj.forEach
				// //$scope.rawData["Delta Airlines"]
				// // var obj = Object.entries($scope.rawData).map(([key, value]) => [key, value[2010][0]]).map();
				// //Example of how to calculate what I need
				// //var obj = Object.entries($scope.rawData["Delta Air Lines"][2010])[0][1].reduce((total, amount) => total + amount)
				// debugger;

				// $scope.$apply();
			});
		};

		//Apply function
		csvData("data/claims.csv");

		function convertDollarToInteger(dollar) {
			return Number(dollar.replace(/[^0-9\.-]+/g,""));
		}

		function captureRawData(data, index) {
			var d = new Date(data.IncidentDate)		//Convert CSV date into a real date
			var month = d.getMonth();				//Get month
			var year = d.getFullYear();				//Get year

			//If the close amount is not a '-' then turn it into an integer
			if (data.CloseAmount === '-') return;
			value = convertDollarToInteger(data.CloseAmount);
			if (!value) return;
			try {
				var airlineName = data.AirlineName.trim();
				$scope.rawData[airlineName] = $scope.rawData[airlineName] || Object.assign({}, yearMonthStructure());
				$scope.rawData[airlineName][year][month].push(value);
				return;
			} catch (e) {
				// debugger;
			}
		}

		// function graph2(data, index) {
		// 	//										//
		// 	//		DATA PROCESSING FOR GRAPH 2 	//
		// 	//										//
		//
		// 	// If the airport code isn't in my reference array. Add the airport code
		// 	if (!airportCodes.includes(data.AirportCode))
		// 	{
		// 		//Create claims by airport
		// 		$scope.graph2data[data.AirportCode] = Object.assign({}, yearMonthStructure());
		//
		//
		// 		//Increment the claims count by one
		// 		$scope.graph2data[data.AirportCode][year][month] += 1;
		//
		// 		//Increase the total number of airports
		// 		$scope.totalNumAirports++;
		//
		// 		//Put the airport code in my reference array
		// 		airportCodes.push(data.AirportCode)
		//
		// 		//Same issue as in graph1
		// 		if ($scope.totalNumAirports == 404)
		// 		{
		// 			for (i = 2010; i < 2014; i++)
		// 			{
		// 				for (j = 0; j < 12; j++)
		// 				{
		// 					var avg = $scope.avgClaimsPerMonth[i][j] = $scope.totalClaimsPerMonth[i][j] / $scope.totalNumAirports;
		// 					$scope.test.data.push({label: "name", value: avg});
		// 				}
		// 			}
		// 		}
		// 	}
		// 	else
		// 	{
		// 		//Increment the airport object by one in the proper year and date
		// 		$scope.graph2data[data.AirportCode][year][month] += 1;
		//
		// 		//Increment the total claims per year per month by one
		// 		$scope.totalClaimsPerMonth[year][month] += 1;
		//
		// 		//Calculate averages
		// 		$scope.avgClaimsPerMonth[year][month] = $scope.totalClaimsPerMonth[year][month] / $scope.totalNumAirports;
		//
		// 	}
		// }

	}])
