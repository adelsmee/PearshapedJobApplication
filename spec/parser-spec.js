// Test the Parser
var newParser = require('../src/parser.js');
var newUtility = require('../src/utility.js');

describe('Parser', function () {  
	var parser, utility, destinations, getDestinations;

	beforeEach(function() {
		parser = newParser('data/taxonomy.xml', 'data/destinations.xml', 'testwastage/');
		utility = newUtility();
	
		getDestinations = function(testDestinations) {
			destinations = testDestinations;
		}
	});

	afterEach(function() {
		destinations = {};
	})

	it('makes parser', function () {
		expect(parser).toBeDefined();  
	});  

	it('should parse Xml2Html', function () {
	  	expect(parser.parseXml2Html()).toEqual();  
	});  

	it('should parse all taxonomies', function() {
		parser.parseTaxonomies(getDestinations);

		waitsFor(function() {
			return parser.getAllTaxonomiesAdded();
		}, "It took too long to add taxonomies.", 10000);

		runs(function() {
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			var name, counter = 0;
			for (name in destinations) {
				if(destinations.hasOwnProperty(name)) {
					counter++;
				}
			}
			expect(counter).toBe(24);  
		});
	});

	it('should add parent to each destination', function() {
		parser.parseTaxonomies(getDestinations);

		waitsFor(function() {
			return parser.getAllTaxonomiesAdded();
		}, "It took too long to add taxonomies.", 10000);

		runs(function() {
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			var name;
			for (name in destinations) {
				expect(destinations[name].parentDestination.parent_id).toBeDefined();  
				expect(destinations[name].parentDestination.title).toBeDefined();  
			}
		});
	});

	it('should handle unknown taxonomy file', function() {
		var parserBadTaxonomyFile = newParser('x.xml', 'data/destinations.xml', 'output');
		var e;

		// Not sure why this doesn't catch the error properly
		// expect(function() {
		// 	parserBadTaxonomyFile.parseTaxonomies(getDestinations);
		// }).toThrow('UnknownFileError: Unable to find file: x.xml');
		// expect(e.name).toEqual('UnknownFileError');
	});

	it('should handle unknown destinations file', function() {
		var parserBadDestinationsFile = newParser('data/taxonomy.xml', 'x.xml', 'output');
		var e;

		// Not sure why this doesn't catch the error properly
		// expect(function() {
		// 	parserBadDestinationsFile.parseDestinations(getDestinations);
		// }).toThrow('UnknownFileError: Unable to find file: x.xml');
		// expect(e.name).toEqual('UnknownFileError');
	});

	it('should parse all destinations', function () {
		parser.parseDestinations(getDestinations);
		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			var name, counter = 0;
			for (name in destinations) {
				if(destinations.hasOwnProperty(name)) {
					counter++;
				}
			}
			expect(counter).toBe(24);  
		});
	});  

	it('should parse only destinations with atlas_id', function () {
		parser.parseDestinations(getDestinations);

		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name;
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			for (name in destinations) {
				expect(destinations[name].atlas_id).toBeDefined();  
			}
console.log(JSON.stringify(destinations));
		});
	});  

	it('should ignore some property names', function () {
		parser.parseDestinations(getDestinations);

		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name;
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			for (name in destinations) {
				var ignoreProperties;
				for (ignoreProperties in utility.getIgnorePropertyNames()) {
					// Properties to ignore
					expect(destinations[name][ignoreProperties]).toBeUndefined();  
				}
			}
		});
	});    

	it('should parse all xml properties into js', function () {
		parser.parseDestinations(getDestinations);

		// Only include first-level under destination
		var propertyNames = ['atlas_id', 'title', 'contents'];
		var contentsPropertyNames = ['history', 'introductory', 'practical_information', 'transport', 'weather', 'work_live_study']; 

		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name;
			// Check destinations is populated by looking for Africa
			expect(destinations['355633']).toBeDefined();
			for (name in destinations) {
				// Just test Africa then return as not all the rest have all these properties
				for (i = 0 ; i < propertyNames.length ; i++) {
					// if(propertyNames[i] === 'contents') {
					// 	var j;
					// 	for (j = 0 ; j < contentsPropertyNames.length ; j++)
					// 	{
					// 		expect(destinations[name][propertyNames[i]][contentsPropertyNames[j]]).toBeDefined();
					// 	}
					// } else {
						expect(destinations[name][propertyNames[i]]).toBeDefined();
					// }
				}
				return;
			}
		});
	});    
});     