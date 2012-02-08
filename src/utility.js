// Utility functions for general use

function newUtility() {

	var ignorePropertyNames = {
		asset_id: 'n',
		titleascii: 'n'
	};

	var propertyNameMap = {
			atlas_id: 'atlasId',
			parent_id: 'parentId',
			atlas_node_id: 'atlasId'	
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
		getPropertyNameMap: function() {
			return propertyNameMap;
		},
		isArray: function(obj) {
			return isArray(obj);
		}
	};
}

module.exports = newUtility;