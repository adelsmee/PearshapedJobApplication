// Utility functions for general use

function newUtility() {

	var ignorePropertyNames = {
		asset_id: 'n',
		titleascii: 'n',
		destination: 'n',
		'@': 'n'
	};

	function isArray(obj) {
	   if (obj.constructor.toString().indexOf("Array") == -1) {
	      return false;   	
	   }
	   else {
	      return true;
	   }
	}

	return {

		getIgnorePropertyNames: function() {
			return ignorePropertyNames;
		},
		isArray: function(obj) {
			return isArray(obj);
		}
	};
}

module.exports = newUtility;