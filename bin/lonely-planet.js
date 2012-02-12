// Lonely-Planet.js 1.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.

// The  Planet module that encapsulates this application.
function newPlanet() {
	// Includes
	var newParser = require('../src/parser.js'),
	// Arguments: taxonomy file, destination file, output directory
	// Ignore first two arguments as they are loc of node and current file
	planetArgs = process.argv.splice(2);

	return {
		parseXML: function(){
			var parser = newParser(planetArgs[0], planetArgs[1], planetArgs[2]);
			parser.parseXml2Html();
		}

	};
}

var planet = newPlanet();
planet.parseXML();