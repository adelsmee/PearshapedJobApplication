
function newParser(taxonomyXML, destinationsXML) {
	var fs = require('fs'),
		xml2js = require('xml2js'),
		siteMaker = require('./siteMaker.js');
	
	var convertObjectsToHTML = function convert(rootObject) {
		var name; 
		for (name in rootObject) {
			var nextProperty = rootObject[name];
			if (typeof nextProperty !== 'function' && typeof nextProperty !== 'object') { 
				console.log(name + ': ' + nextProperty);
			}
			else if(typeof nextProperty === 'object') {
				convert(nextProperty);
			}
		}
	};

	function parseTaxonomy() {
		var parser = new xml2js.Parser();
		console.log('Trying to parse taxonomy file: ' + taxonomyXML);
		
		fs.readFile(taxonomyXML, function(err, data) {
			parser.parseString(data, function(err, result) {
				convertObjectsToHTML(result);
			});
			console.log('Done Taxonomy');	
		});
	}

	function parseDestinations() {
		var parser = new xml2js.Parser();
		console.log('Trying to parse destinations file: ' + destinationsXML);
		
		fs.readFile(destinationsXML, function(err, data) {
			parser.parseString(data, function(err, result) {
				convertObjectsToHTML(result);
			});
			console.log('Done Destinations');	
		});
	}

	return {

		parseXml2Html: function(){
			parseTaxonomy();
			parseDestinations();
		}
	};
}

module.exports = newParser;