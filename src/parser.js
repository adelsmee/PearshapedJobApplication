// Parser.js 1.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.

// The Parser that reads raw XML and produces HTML files.
function newParser(xmlRepository, pageMaker) {
	var xml2js = require('xml2js'),
		util = require('util'),
		config = require('./config.js'),
		nextDestination = {},
		destinations = {},
		numberOfObjectsToConvert = 0,
		allDestinationsConverted = false,
		allTaxonomiesAdded = false,
		ignorePropertyNames = config.xml.ignorePropertyNames;

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
					nextDestination = {};
				}
				
				// Ignore array elements as they will be stored in their respective objects
				if(isNaN(propertyName)){
					// Store contents
					if(propertyName !== 'atlas_id' && propertyName !== 'title') {
						nextDestination.contents = nextDestination.contents ? nextDestination.contents : [];
						var contentObject = {};
						// Clean up that introductory silly name
						propertyName = (propertyName === 'introductory') ? 'introduction' : propertyName;

						contentObject[propertyName] = nextPropertyValue;
						nextDestination.contents.push(contentObject);
					}				
					else {
						// Store metadata
						nextDestination[propertyName] = nextPropertyValue;
					}
				}	
			}

			// If value is an object then don't recurse any further.
			// But continue to recurse for arrays and attributes.
			if(util.isArray(nextPropertyValue) || nextPropertyValue['@'] || nextPropertyValue['atlas_id'] || !typeof nextPropertyValue === 'object') {
				// Count up and down the recursive tree so we can let others know when the parsing is done
				numberOfObjectsToConvert++;
				convertJsObjectsToDestinations(nextPropertyValue, sendResponse);
				numberOfObjectsToConvert--;
			}
		}

		if(numberOfObjectsToConvert === 0) {
			// Store the last destination
			destinations[nextDestination.atlas_id] = nextDestination;
			console.log('Destinations parsed to js objects');	
			// For testing
			sendResponse(destinations);
			allDestinationsConverted = true;
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
					var addToDestination = destinations[nextPropertyValue.atlas_node_id],
						parentDestination = parent_id ? destinations[parent_id] : null,
						parentTitle = (parentDestination ? parentDestination.title : null);

					// Add parent id to current destination
					if(addToDestination) {						
						addToDestination.parentDestination = { 
							parent_id: parent_id,
							title: parentTitle
						}
					}

					// Add child to parent destination
					if(parentDestination && (parentDestination.title !== addToDestination.title)) {
						// Initialize children array if not created yet.
						parentDestination.children = parentDestination.children ? parentDestination.children : [];
						parentDestination.children.push({
							atlas_id: nextPropertyValue.atlas_node_id,
							title: addToDestination.title
						});
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
			console.log('Taxonomy parsed to js objects');	
			sendResponse(destinations);
			allTaxonomiesAdded = true;
		}
	}


	function parseTaxonomies(sendResponse) {
		var parser = new xml2js.Parser();
		console.log('Parsing taxonomy file to js objects');
		xmlRepository.getTaxonomyXml(function(xmlTaxonomy) {
			if(xmlTaxonomy.length > 0) {
				// Parse the XML into JS objects
				parser.parseString(xmlTaxonomy, function(err, result) {
					if(err) {
		            	console.error(err);
						throw new Error('Unable to parse file: ' + taxonomyXml); 
					} else {
						addTaxonomyObjectsToDestinations(result, null, sendResponse);	
					}
				});
			}
			
		});
	}

	function parseDestinations(sendResponse) {
		var parser = new xml2js.Parser();
		console.log('Parsing destinations to js objects');
		xmlRepository.getDestinationsXml(function(xmlDestinations){	
			if(xmlDestinations.length > 0) {
				// Parse the XML into JS objects
				parser.parseString(xmlDestinations, function(err, result) {
					if(err) {
	                	console.error(err);
						throw new Error('Unable to parse file: ' + destinationsXml); 
	        		} 

					convertJsObjectsToDestinations(result, sendResponse);	
				});
			}
		});
	}

	return {

		// Public function
		parseXml2Html: function() {
			var startDate = new Date();
			console.log('Parsing started: ' + startDate);
			console.log();
			parseDestinations(function(destinations) {
				// Add taxonomies to destination objects
				parseTaxonomies(function(completedDestinations) {
					console.log('Parsing Destinations to .html files...');
					pageMaker.makeDestinationPages(completedDestinations, function(finished){
						while(!finished){};
						var endDate = new Date();
						console.log();
						console.log('Parsing ended: ' + endDate);
					});
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