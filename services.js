angular.module("services", ["ngResource"]).
	service("companyService", function($resource) {
		var defaultCallbacks = { success: function() {}, error: function() {}, complete: function() {} };

		return {
			getBySymbol: function(symbol, cbs) {
				cbs = angular.extend({}, defaultCallbacks, cbs);

				var url = "http://dev.markitondemand.com/Api/Quote/jsonp?callback=JSON_CALLBACK";
				url = "http://localhost/internal/modapis/api/quote/:action";

				var query = $resource(url,
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
						cbs.errror();
						cbs.complete();
					}
				);
			}
		};
	});