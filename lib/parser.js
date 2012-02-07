
function newParser(taxonomyXML, destinationsXML) {
	var fs = require('fs'),
		xml2js = require('xml2js'),
		siteMaker = require('./siteMaker.js'),
		propertyNameMap = {
			atlas_id: 'atlasId',
			parent_id: 'parentId',
			atlas_node_id: 'atlasId'	
		},
		ignorePropertyNames = {
			asset_id: 'n',
			titleascii: 'n'
		},
		nextDestination = {},
		destinations = []; 

	function removeDirtyCharacters(aString) {
		return aString.replace(/-/g, '');
	}

	function convertObjectsToDestinations(objectToConvert) {
		var name;

		for (name in objectToConvert) {
			var nextPropertyValue = objectToConvert[name];

			if (typeof nextPropertyValue !== 'function' && typeof nextPropertyValue !== 'object') { 
				var propertyName = name;
				// clean the property name of hyphens
				propertyName = removeDirtyCharacters(propertyName);
				
				if (ignorePropertyNames[propertyName]) {
					// do nothing
				} 
				else {
					if (propertyNameMap[propertyName]) {
						propertyName = propertyNameMap[propertyName];
						
						// If property name is atlasId we are on to the next object in the tree
						// so store the last one in the collection of destinations.
						if(propertyName === 'atlasId' && nextDestination.atlasId){
							console.log("Adding this destination to the collection: " + JSON.stringify(nextDestination).slice(0, 100));
							destinations.push(nextDestination);
							nextDestination = {};
						}
					}
					nextDestination[propertyName] = nextPropertyValue;
				}
			}
			else if(typeof nextPropertyValue === 'object') {
				convert(nextPropertyValue);
			}
		}
	};

	function parseTaxonomy() {
		var parser = new xml2js.Parser();
		console.log('Trying to parse taxonomy file: ' + taxonomyXML);
		
		fs.readFile(taxonomyXML, function(err, data) {
			parser.parseString(data, function(err, result) {
				convertObjectsToDestinations(result);
			});
			console.log('Done Taxonomy');	
		});
	}

	function parseDestinations() {
		var parser = new xml2js.Parser();
		console.log('Trying to parse destinations file: ' + destinationsXML);
		
		fs.readFile(destinationsXML, function(err, data) {
			parser.parseString(data, function(err, result) {
				convertObjectsToDestinations(result);
			});
			console.log('Done Destinations');	
		});
	}

	return {

		parseXml2Html: function(){
			parseDestinations();
//			parseTaxonomy();
		}
	};
}

module.exports = newParser;