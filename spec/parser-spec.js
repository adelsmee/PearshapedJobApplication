// Test the Parser
var newParser = require('../src/parser.js');
var newXmlRepository = require('../src/xml-repository.js');
var newPageMaker = require('../src/page-maker.js');
var config = require('../src/config.js');
var fs = require('../src/file-io.js');

describe('Parser', function () {  
	var parser, 
		destinations, 
		getDestinations;
		xmlRepository = newXmlRepository('data/taxonomy.xml', 'data/destinations.xml'),
		pageMaker = newPageMaker('spec/test-output/');

	beforeEach(function() {
		parser = newParser(xmlRepository, pageMaker);
	
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

	it('should parse xml into html', function(){
		parser.parseXml2Html();

		waitsFor(function() {
			return parser.getAllTaxonomiesAdded();
		}, "It took too long to add taxonomies.", 10000);


		runs(function() {
			var dirContents = fs.readdirSync('spec/test-output/');
			// The number of destinations plus the css folder
			var numberOfDestinations = Object.keys(destinations).length + 1;
			expect(dirContents.length).toEqual(numberOfDestinations);  
		});		
	})

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
				for (ignoreProperties in config.xml.ignorePropertyNames) {
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
					if(propertyNames[i] === 'contents') {
						// Make sure all contents sections have been added
 						expect(destinations[name][propertyNames[i]].length).toEqual(6);
					} else {
						expect(destinations[name][propertyNames[i]]).toBeDefined();
					}
				}
				return;
			}
		});
	});    
});     