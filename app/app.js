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

		$scope.test = {
			chart: {
				caption: "Average Loss Per Month",
				subCaption: "Across All Airlines",
				theme: "fint"
			},

			data: []
		};

		var airportCodes = [];

		//Function to input csv data file
		function csvData(file) {
		  d3.csv(file, function(data, index) {
				captureRawData(data, index);
		  }).then(function(data) {
				$scope.rawData["Delta Airlines"]
				// var obj = Object.entries($scope.rawData).map(([key, value]) => [key, value[2010][0]]).map();
				//Example of how to calculate what I need
				//Object.entries($scope.rawData["Delta Air Lines"][2010])[0][1].reduce((total, amount) => total + amount)
				debugger;

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
