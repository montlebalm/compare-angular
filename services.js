angular.module("services", ["ngResource"]).
	service("companyService", function($resource) {
		var defaultCallbacks = { success: function() {}, error: function() {}, complete: function() {} };

		return {
			getBySymbol: function(symbol, cbs) {
				cbs = angular.extend({}, defaultCallbacks, cbs);

				var query = $resource(
					"http://dev.markitondemand.com/Api/Quote/:action",
					{ action: "jsonp", callback: "JSON_CALLBACK", symbol: symbol },
					{ get: { method: "jsonp" } }
				);

				query.get(
					function(response) {
						if (response.Data) {
							cbs.success(response.Data);
						}
						else {
							cbs.error("Invalid symbol");
						}

						cbs.complete();
					},
					function() {
						cbs.error();
						cbs.complete();
					}
				);
			}
		};
	});