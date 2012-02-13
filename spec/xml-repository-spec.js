// Test XmlRepository
var newXmlRepository = require('../src/xml-repository.js'),
	path = require('path');

describe('XmlRepository', function () {  
	var xmlRepository,
		xmlReturned = false,
		xmlData,
		returnXml = function(data){
			xmlData = data;
			xmlReturned = true;
		};

	beforeEach(function() {
		xmlRepository = newXmlRepository('data/taxonomy.xml', 'data/destinations.xml');
	});

	afterEach(function() {
		xmlReturned = false;
		xmlData = undefined;
	})

	it('makes xmlRepository', function () {
		expect(xmlRepository).toBeDefined();
	});  

	it('should get destinations xml', function(){
		xmlRepository.getDestinationsXml(returnXml);
		
		waitsFor(function() {
			return xmlReturned;
		}, 'Took too long to get xml', 10000);

		runs(function() {
			expect(xmlData).toBeDefined();			
		});
	});

	it('should get taxonomy xml', function(){
		xmlRepository.getTaxonomyXml(returnXml);
		
		waitsFor(function() {
			return xmlReturned;
		}, 'Took too long to get xml', 10000);

		runs(function() {
			expect(xmlData).toBeDefined();			
		});
	});
});     