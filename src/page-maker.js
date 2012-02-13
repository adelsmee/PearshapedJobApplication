// PageMaker.js 1.0.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.
//
// The PageMaker module converts JavaScript destination objects
// into static html pages
function newPageMaker(outputDir) {
	var config = require('./config.js'),
		fileIo = require('./file-io.js'),
		newTemplate = require('./template.js'),
		template = newTemplate(),
		path = require('path'),
		util = require('util'),
		createOutputDir = function() {
			outputDir = outputDir ? outputDir : config.site.defaultOutputDir;
			var outputDirExists = path.existsSync(outputDir);
			if(!outputDirExists) {
				fileIo.mkdir(outputDir);
			}

			var i,
				siteFiles = config.site.files;

			for(i = 0 ; i < siteFiles.length ; i++){
				var nextFileData = siteFiles[i];
				var originalFile = nextFileData.originalPath + "/" + nextFileData.filename;
				var newFile = outputDir + nextFileData.destinationFolder + '/' + nextFileData.filename;
				// Move supporting files to output dir
				fileIo.mkdir(outputDir + nextFileData.destinationFolder);
				fileIo.copyFile(originalFile, newFile);
			}
		}();

	function makeDestinationPages(destinations, finished) {
		var jsdom = require('jsdom');
		// Store the template in the jquery object for manipulation
		var data = template.pageHtml();

		jsdom.env({
			html: data,
			scripts: [
				'http://code.jquery.com/jquery-1.5.min.js',
			]
		}, function (err, window) {
			var $ = window.jQuery;
			var destinationId;
			var pageCounter = 0;
			var totalDestinations = Object.keys(destinations).length;

			for(destinationId in destinations){
				var destinationFilePath = '',
					pageContents = '',
					destination = {};
					destination = destinations[destinationId];

				// Now document is loaded can traverse the DOM using JQuery, 
				$(template.titleClass).text(destination.title);
				var navigationHtml = makePageNavigation(destination);
				$(template.navigationDivId).html(navigationHtml);
	  			
	  			// Add content
	  			if(destination.contents) {
	  				pageContents = makePageContents(destination.contents);
					$(template.contentTextDivId).html(pageContents);
	  			}

	  			// Append header and footer tags
	  			var destinationFileContents = util.format(template.page, $('html').html());
				destinationFilePath = outputDir + formatDestinationNameAsHtmlFilename(destination.title);
				

				savePage(destinationFilePath, destinationFileContents, function(){
					pageCounter++;

					if(pageCounter === totalDestinations){
						finished(true);
					}
				})
			}
		});
	}

	function savePage(saveDestination, contents, pageSaved) {
		fileIo.writeFile(saveDestination, contents, function(err){
			if(err){
				console.log('could not write to file: ' + destinationFilePath);
				throw err;
			}

			pageSaved();
		});
	}

	function makePageNavigation(destination) {	
		var navigationHtml,
			links = [];  			
		// Add parent navigation
		if(destination.parentDestination && destination.parentDestination.title){
			links.push(util.format(	template.listLink,
										 	'parent',  
  									 	 	formatDestinationNameAsHtmlFilename(destination.parentDestination.title),
  									 	 	destination.parentDestination.title));	  			
			links.push(util.format(	template.listLink,
											'current', 
  									 	  	formatDestinationNameAsHtmlFilename(destination.title),
  									 	  	destination.title));
	  	}
  		// Add child navigation
		if(destination.children) {
			var i;
			for(i = 0 ; i < destination.children.length ; i++) {
				links.push(util.format(	template.listLink,
										'child', 
  									 	formatDestinationNameAsHtmlFilename(destination.children[i].title),
  									 	destination.children[i].title));
			}
		}
		return template.buildNavigationHtml(links);
	}

	function makePageContents(allContents) {
	  	// Loop through the contents object and print each heading at each level
	  	var i,
	  		contentHtml = '',
	  		headingLevel = 2;

		for(i = 0 ; i < allContents.length ; i++){
			var nextContentObject = allContents[i];
			var nextSectionHtml = makeInnerSectionHtml(nextContentObject, headingLevel);
			contentHtml += util.format(template.section, nextSectionHtml);
		}

		return contentHtml;	
	}

	function makeInnerSectionHtml(sectionContentObject, headingLevel) {
		var name,
			innerSectionHtml = '';
										
		for(name in sectionContentObject) {
			// Create first heading
			innerSectionHtml += util.format(template.heading, headingLevel, formatHeadingText(name), headingLevel);

			// If there's any text content add that
			if(typeof sectionContentObject[name] === 'string' || util.isArray(sectionContentObject[name])){
				if(typeof sectionContentObject[name] === 'string'){
					innerSectionHtml += util.format(template.paragraph, sectionContentObject[name]);
				} else {
					var j;
					for(j = 0 ; j < sectionContentObject[name].length ; j++) {
						innerSectionHtml += util.format(template.paragraph, sectionContentObject[name][j]);
					}
				}
			} else if(typeof sectionContentObject[name] === 'object' && !util.isArray(sectionContentObject[name])) {
				headingLevel++;
				innerSectionHtml += makeInnerSectionHtml(sectionContentObject[name], headingLevel);
				headingLevel = 2;
			}
		}

		return util.format(template.innerSection, innerSectionHtml);
	}

	function formatDestinationNameAsHtmlFilename(destinationName) {
		return destinationName.toLowerCase().replace(/ /g, '-') + '.html';
	}

	function formatHeadingText(propertyName) {
		return propertyName.replace(/_/g, ' ');
	}

	return {
		// Public methods
		makeDestinationPages: function(destinations, finished){
			makeDestinationPages(destinations, finished);
		},
		areAllPagesCreated: function(){
			return allPagesCreated;
		}

	};
}

module.exports = newPageMaker;