(function() {

	var app = angular.module("compareTool", ["filters", "services"]);

	// Compare Controller
	app.controller("CompareCtrl", function($scope, $filter, companyService) {

		// The max number of companies the user can compare
		var maxSymbols = 5;

		// Define what will be displayed
		$scope.dataPoints = [
			{ label: "Last Price", field: "LastPrice", format: "currency" },
			{ label: "High", field: "High", format: "currency" },
			{ label: "Low", field: "Low", format: "currency" },
			{ label: "Open", field: "Open", format: "currency" },
			{ label: "Market Cap", field: "MarketCap", format: "number" },
			{ label: "Volume", field: "Volume", format: "number" },
			{ label: "Change", field: "Change", format: "currency" },
			{ label: "Change %", field: "ChangePercent", format: "percent:2" },
			{ label: "Change YTD", field: "ChangeYTD", format: "currency" },
			{ label: "Change % YTD", field: "ChangePercentYTD", format: "percent:2" }
		];

		// List of symbols we're comparing
		// Sample: http://dev.markitondemand.com/Api/Quote/jsonp?symbol=aapl
		$scope.issues = [];

		// Get the number of empty compare slots
		$scope.numRemaining = function() {
			return maxSymbols - $scope.issues.length;
		};

		$scope.addCompany = function(ticker) {
			var self = this;

			// Use THIS instead of $scope, because we're actually in the scope
			// of the clicked dom element
			this.isLoading = true;

			companyService.getBySymbol(ticker, {
				success: function(data) {
					$scope.issues.push(data);
					self.searchSymbol = "";
				},
				error: function(msg) {
					msg = msg || "Sorry, that didn't work for some reason";
					alert(msg);
				},
				complete: function() {
					self.isLoading = false;
				}
			});
		};

		// Pull the company out of comparison
		$scope.removeCompany = function(ticker) {
			// Remove the symbol
			for (var i = 0; i < $scope.issues.length; i++) {
				if ($scope.issues[i].Symbol === ticker) {
					$scope.issues.splice(i, 1);
					break;
				}
			}
		};

		// Multi-purpose format func
		$scope.format = function(value, type) {
			var out = value;

			if (type) {
				var params = type.split(":");
				type = params[0];

				switch (type) {
					case "percent":
						out = value.toFixed(params[1] || 0) + "%";
						break;
					case "number":
						out = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						break;
					default:
						// Use the default angular filter
						out = $filter(type)(value);
						break;
				}
			}

			return out;
		};

	});

})();