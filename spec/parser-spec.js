// Test the Parser
var newParser = require('../src/parser.js');

describe('Parser', function () {  
	var parser;
	var destinations;
	var getDestinations;

	beforeEach(function() {
		parser = newParser('data/taxonomy.xml', 'data/destinations.xml');
	
		getDestinations = function(testDestinations) {
			destinations = testDestinations;
		}
	});

	it('makes parser', function () {
		expect(parser).toBeDefined();  
	});  

	it('should parse Xml2Html', function () {
	  expect(parser.parseXml2Html()).toEqual();  
	});  

	it('should parse taxonomy', function () {
	  expect(parser.parseTaxonomy()).toEqual();  
	});

	it('should parse all destinations', function () {
		parser.parseDestinations(getDestinations);
		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name, counter = 0;
			for (name in destinations) {
				if(destinations.hasOwnProperty(name)) {
					counter++;
				}
			}
			expect(counter).toBe(24);  
		});

	});  

	it('should parse only destinations with atlasId', function () {
		parser.parseDestinations(getDestinations);

		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name;
			for (name in destinations) {
				expect(destinations[name].atlasId).toBeDefined();  
			}
		});
	});  

	it('should ignore some property names and remove hyphen from others', function () {
		parser.parseDestinations(getDestinations);

		waitsFor(function() {
			return parser.getAllDestinationsConverted();
		}, "It took too long to convert destinations.", 10000);

		runs(function() {
			var name;
			for (name in destinations) {
				// Properties to ignore
				expect(destinations[name].asset_id).toBeUndefined();  
				expect(destinations[name].titleascii).toBeUndefined();  
				expect(destinations[name].parent_id).toBeUndefined();  
				// Properties to remove hyphen from
				expect(destinations[name].atlasId).toBeDefined();  
			}
		});
	});    
});  