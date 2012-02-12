// Test the PageMaker
var newPageMaker = require('../src/pageMaker.js');

describe('PageMaker', function () {  
	var destinations,
		fs = require('fs'),
		destinationsJson = 'spec/test-destinations.json'
		outputFolder = 'testpagemakeroutput/';

	beforeEach(function() {
		pageMaker = newPageMaker(outputFolder);
		
		var data;
console.log('opening test json file');
		try{
			var data = fs.readFileSync(destinationsJson);
			destinations = JSON.parse(data); 
		} catch(err){
			console.error('Error reading file: ' + destinationsJson + '.  ERR: ' + err);
		}	
	});

	it('should make destination pages', function () {
		pageMaker.makeDestinationPages(destinations);

		waitsFor(function() {
			return pageMaker.areAllPagesCreated();
		}, "It took too long to convert pages.", 100000);

		runs(function() {
			var dirContents = fs.readdirSync(outputFolder);
console.log('how many files in dir: ' + dirContents.length);
			// The number of destinations plus the css folder
			var numberOfThingsInOutputDir = Object.keys(destinations).length + 1;
			expect(dirContents.length).toEqual(numberOfThingsInOutputDir);  
		});
	});  

	it('should make output folder', function () {
		pageMaker.makeDestinationPages(destinations);
		expect(destinations).toBeDefined();  
	});  

	it('should move css file to output folder', function () {
		pageMaker.makeDestinationPages(destinations);
		expect(destinations).toBeDefined();  
	});  
});
