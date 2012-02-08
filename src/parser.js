function newParser(taxonomyXml, destinationsXml) {
	var fs = require('fs'),
		xml2js = require('xml2js'),
		siteMaker = require('./siteMaker.js'),
		newUtility = require('./utility.js'),
		utility = newUtility();
		nextDestination = {},
		destinations = {},
		numberOfObjectsToConvert = 0,
		allDestinationsConverted = false,
		ignorePropertyNames = utility.getIgnorePropertyNames(),
		propertyNameMap = utility.getPropertyNameMap(); 

	function convertDestinationObjectsToDestinations(objectsToConvert, sendResponse) {
		var name;

		for (name in objectsToConvert) {
			var nextPropertyValue = objectsToConvert[name];

			if (typeof nextPropertyValue !== 'function' && typeof nextPropertyValue !== 'object') { 
				var propertyName = name;
				// clean the property name of hyphens
				propertyName = propertyName.replace(/-/g, '');
				
				if (!ignorePropertyNames[propertyName]) {
					if (propertyNameMap[propertyName]) {
						propertyName = propertyNameMap[propertyName];
						
						// If property name is atlasId we are on to the next object in the tree
						// so store the last one in the destinations object.
						if(propertyName === 'atlasId' && nextDestination.atlasId){
							destinations[nextDestination.atlasId] = nextDestination;
							nextDestination = {};
						}
					}
					nextDestination[propertyName] = nextPropertyValue;
				}
			}
			else if(typeof nextPropertyValue === 'object') {
				// Count up and down the recursive tree so we can let others know when the parsing is done
				numberOfObjectsToConvert++;
				convertDestinationObjectsToDestinations(nextPropertyValue, sendResponse);
				numberOfObjectsToConvert--;
			}
		}
console.log('added dest: ' + nextDestination.title);

		if(numberOfObjectsToConvert === 0) {
			sendResponse(destinations);
			allDestinationsConverted = true;
		}
	}	

	function addTaxonomyObjectsToDestinations(objectsToAdd, parentId) {
		var name;

		if(destinations.length === 0) {
			return;
		}

		for (name in objectsToAdd) {
			var nextPropertyValue = objectsToAdd[name];

			if(typeof nextPropertyValue === 'object') {
				// If it is a node then add its data to the appropriate destination
				if(nextPropertyValue.atlas_node_id) {
					var addToDestination = destinations[nextPropertyValue.atlas_node_id];

					// Add parent id to current destination
					if(addToDestination) {						
						addToDestination.parentId = parentId;
					}
					
					// Add child id to parent destination
					if(parentId) {
						var addToParentDestination = destinations[parentId];
						// Initialize childIds array if not created yet.
						addToParentDestination.childIds = addToParentDestination.childIds ? addToParentDestination.childIds : [];
						addToParentDestination.childIds.push(nextPropertyValue.atlas_node_id);
					}
				}
						
				// Count up and down the recursive tree so we can let others know when the parsing is done
				numberOfObjectsToConvert++;
				addTaxonomyObjectsToDestinations(nextPropertyValue, parentId);
				numberOfObjectsToConvert--;

				if(nextPropertyValue.atlas_node_id) {
					parentId = nextPropertyValue.atlas_node_id;
				} 
			} 
		}

		if(numberOfObjectsToConvert === 0) {
			allTaxonomiesAdded = true;
		}
	}

	function parseTaxonomy() {
		var parser = new xml2js.Parser();
		console.log('Trying to parse taxonomy file: ' + taxonomyXml);
		
		fs.readFile(taxonomyXml, function(err, data) {
			if(err) {
            	console.error(err);
    		} else if(data.length > 0) {
    			// Parse the XML into JS objects
				parser.parseString(data, function(err, result) {
					if(err) {
		            	console.error(err);
					} else {
						addTaxonomyObjectsToDestinations(result, null);	
					}
				});
			}

			console.log('Done Taxonomy');	
		});
	}

	function parseDestinations(sendResponse) {
		var parser = new xml2js.Parser();
		console.log('Trying to parse destinations file: ' + destinationsXml);

		fs.readFile(destinationsXml, function(err, data) {
			parser.parseString(data, function(err, result) {
				if(err) {
                	console.error(err);
        		} else if(data.length > 0){
					convertDestinationObjectsToDestinations(result, sendResponse);	
				}
			});
		});
	}

	return {

		// Public function
		parseXml2Html: function() {
			parseDestinations(function(destinations) {
				// Add taxonomies to destination objects
				parseTaxonomy();
			});
		},
		// Expose functions for testing purposes
		getAllDestinationsConverted: function() {
			return allDestinationsConverted;
		},
		parseDestinations: function(sendResponse) {
			parseDestinations(sendResponse);
		},
		parseTaxonomy: function() {
			//parseTaxonomy();
		}
	};
}

module.exports = newParser;