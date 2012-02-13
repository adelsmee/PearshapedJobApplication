// Test the PageMaker
var newPageMaker = require('../src/page-maker.js');

describe('PageMaker', function () {  
	var destinations,
		fs = require('fs'),
		config = require('../src/config.js'),
		destinationsJson = 'spec/test-destinations.json',
		outputFolder = 'spec/test-output/',
		path = require('path'),
		isFinished = false,
		notifyFinished = function(doneMakingPages){
			isFinished = doneMakingPages;
		};

	beforeEach(function() {
		pageMaker = newPageMaker(outputFolder);
		
		var data;
		try{
			var data = fs.readFileSync(destinationsJson);
			destinations = JSON.parse(data); 
		} catch(err){
			console.error('Error reading file: ' + destinationsJson + '.  ERR: ' + err);
		}	
	});

	afterEach(function() {
		isFinished = false;
	});

	it('should make destination pages', function () {
		pageMaker.makeDestinationPages(destinations, notifyFinished);

		waitsFor(function() {
			return isFinished;
		}, "It took too long to make pages.", 10000);

		runs(function() {
			var dirContents = fs.readdirSync(outputFolder);
			// The number of destinations plus the css folder
			var numberOfDestinations = Object.keys(destinations).length + 1;
			expect(dirContents.length).toEqual(numberOfDestinations);  
		});
	});  

	it('should make output folder', function () {
		var outputFolderExists = path.existsSync(outputFolder);
		expect(outputFolderExists).toBeTruthy();
	});  

	it('should move css file to output folder', function () {
		var cssFileExists = path.existsSync(outputFolder + 'css/all.css');
		expect(cssFileExists).toBeTruthy();						
	});  

	it('should output folder to default if none provided', function() {
		pageMaker = newPageMaker();
		var outputFolderExists = path.existsSync(config.site.defaultOutputDir);
		expect(outputFolderExists).toBeTruthy();
	})
});
