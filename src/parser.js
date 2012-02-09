// Parser.js 1.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.

// The Parser that reads raw XML in from a file and produces HTML files.
function newParser(taxonomyXml, destinationsXml) {
	var fs = require('fs'),
		xml2js = require('xml2js'),
		siteMaker = require('./pageMaker.js'),
		newUtility = require('./utility.js'),
		utility = newUtility();
		nextDestination = {},
		destinations = {},
		numberOfObjectsToConvert = 0,
		allDestinationsConverted = false,
		allTaxonomiesAdded = false,
		ignorePropertyNames = utility.getIgnorePropertyNames();
//var counter = 0;
	function convertJsObjectsToDestinations(objectsToConvert, sendResponse) {
		var name;

		for (name in objectsToConvert) {
			var propertyName = name;
			var nextPropertyValue = objectsToConvert[propertyName];
			// clean the property name of hyphens
			propertyName = propertyName.replace(/-/g, '');

			if (!ignorePropertyNames[propertyName]) {						
				// If property name is atlas_id we are on to the next object in the tree
				// so store the last one in the destinations object.
				if(propertyName === 'atlas_id' && nextDestination.atlas_id){
					destinations[nextDestination.atlas_id] = nextDestination;
//console.log('next dest converted: ' + nextDestination.title);
//counter++;
					nextDestination = {};
				}
				
				// Ignore array elements as they will be stored in their respective objects
				if(isNaN(propertyName)){				
					nextDestination[propertyName] = nextPropertyValue;
				}	
			}

			// If value is an object then don't recurse any further.
			// But continue to recurse for arrays and attributes.
			if(utility.isArray(nextPropertyValue) || nextPropertyValue['@'] || nextPropertyValue['atlas_id'] || !typeof nextPropertyValue === 'object') {
				// Count up and down the recursive tree so we can let others know when the parsing is done
				numberOfObjectsToConvert++;
				convertJsObjectsToDestinations(nextPropertyValue, sendResponse);
				numberOfObjectsToConvert--;
			}
		}

		if(numberOfObjectsToConvert === 0) {
			// Catch the last destination
			destinations[nextDestination.atlas_id] = nextDestination;
			allDestinationsConverted = true;
//console.log('responding with destinations: ' + counter);
			sendResponse(destinations);
			console.log('Done Destinations');	
		}
	}	

	function addTaxonomyObjectsToDestinations(objectsToAdd, parent_id, sendResponse) {
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
						addToDestination.parent_id = parent_id ? parent_id : 'World';
//console.log('added parent id to: ' + addToDestination.title);
					}
					
					// Add child id to parent destination
					if(parent_id) {
						var addToParentDestination = destinations[parent_id];
						if(addToParentDestination) {
							// Initialize childIds array if not created yet.
							addToParentDestination.childIds = addToParentDestination.childIds ? addToParentDestination.childIds : [];
							addToParentDestination.childIds.push(nextPropertyValue.atlas_node_id);
						}
					}
				}
						
				// Count up and down the recursive tree so we can let others know when the parsing is done
				numberOfObjectsToConvert++;
				addTaxonomyObjectsToDestinations(nextPropertyValue, parent_id, sendResponse);
				numberOfObjectsToConvert--;

				// Set the parent id when the next level down of traversing is done
				if(nextPropertyValue.atlas_node_id) {
					parent_id = nextPropertyValue.atlas_node_id;
				} 
			} 
		}

		if(numberOfObjectsToConvert === 0) {
			allTaxonomiesAdded = true;
			sendResponse(destinations);
			console.log('Done Taxonomy');	
		}
	}

	function parseTaxonomies(sendResponse) {
		var parser = new xml2js.Parser();
		console.log('Trying to parse taxonomy file: ' + taxonomyXml);
		
		fs.readFile(taxonomyXml, function(err, data) {
			if(err) {
		        console.error('Taxonomies file error: ' + err);
				throw new Error('Unable to find file: ' + taxonomyXml); 
    		} else if(data.length > 0) {
    			// Parse the XML into JS objects
				parser.parseString(data, function(err, result) {
					if(err) {
		            	console.error('Error parsing taxonomies: ' + err);
					} else {
						addTaxonomyObjectsToDestinations(result, null, sendResponse);	
					}
				});
			}
		});
	}

	function parseDestinations(sendResponse) {
		var parser = new xml2js.Parser();
		console.log('Trying to parse destinations file: ' + destinationsXml);

		fs.readFile(destinationsXml, function(err, data) {
			if(err){
				console.error('Destinations file error: ' + err);
				throw new Error('Unable to find file: ' + destinationsXml); 
			} else if(data.length > 0) {
    			// Parse the XML into JS objects
				parser.parseString(data, function(err, result) {
					if(err) {
	                	console.error(err);
	        		} else if(data.length > 0){
						convertJsObjectsToDestinations(result, sendResponse);	
					}
				});
			}
		});
	}

	return {

		// Public function
		parseXml2Html: function() {
			parseDestinations(function(destinations) {
				// Add taxonomies to destination objects
				parseTaxonomies(function() {
					// Create website
				});
			});
		},
		// Expose functions for testing purposes
		getAllDestinationsConverted: function() {
			return allDestinationsConverted;
		},
		getAllTaxonomiesAdded: function() {
			return allTaxonomiesAdded;
		},
		parseDestinations: function(sendResponse) {
			parseDestinations(sendResponse);
		},
		parseTaxonomies: function(sendResponse) {
			parseDestinations(function(destinations) {
				// Add taxonomies to destination objects
				parseTaxonomies(sendResponse);
			});
		}
	};
}

module.exports = newParser;