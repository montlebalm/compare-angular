angular.module("filters", []).
	filter("range", function() {
		return function(input, num) {
			for (var i = 0; i < num; i++) {
				input.push(i);
			}
			return input;
		};
	});