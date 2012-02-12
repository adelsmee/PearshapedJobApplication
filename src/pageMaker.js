
function newPageMaker(outputDir) {
	var fs = require('./graceful-fs.js'),
		path = require('path'),
		util = require('util'),
		templateFile = 'data/template.html',
		cssDirPath = 'data/css/',
		cssFilename = 'all.css',
		outputDirExists = false,
		numberOfContentsToMake = 0, 
		contentsText,
		createOutputDir = function() {
			outputDirExists = path.existsSync(outputDir);
			if(!outputDirExists) {
				fs.mkdir(outputDir);
			}
			// Move supporting files to output dir
			fs.mkdir(outputDir + 'css');
			copyFile(cssDirPath + "/" + cssFilename, outputDir + 'css/' + cssFilename);
		}();

	function makeDestinationPages(destinations, finished) {
		var data;
		try{
			data = fs.readFileSync(templateFile);
		} catch(err){
			console.error('Error reading file: ' + templateFile + '.  ERR: ' + err);
		}
		var jsdom = require('jsdom');
		// Store the template in the jquery object for manipulation
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
//console.log('total destinations: ' + totalDestinations);
			for(destinationId in destinations){
				var destinationFilePath = '',
					parentHref = '',
					pageContents = '',
					destination = {};
					destination = destinations[destinationId];

				// Now document is loaded can traverse the DOM using JQuery, adding the necessaries
				// Add title
				$('.title').text(destination.title);
	  			// Add parent navigation

	  			if(destination.parentDestination && destination.parentDestination.title){
	  				// Clear the old one
	  				$('ul#navigation').empty();
		  			parentHref = destination.parentDestination.title + '.html';
		  			$('<li><a href="' + formatDestinationNameAsHtmlFilename(parentHref) + '">' + destination.parentDestination.title + '</a></li>').appendTo('ul#navigation');
		  			$('<li class="selected"><a href="' + formatDestinationNameAsHtmlFilename(destination.title) + '.html">' + destination.title + '</a></li>').appendTo('ul#navigation');
			  	}
		  			// Add child navigation
	  			if(destination.children) {
// 	  				// Clear the old one
// 	  				$('ul#subNavigation').empty();
// console.log('current children' + $('#subNavigation').html());
// 		  			var i;
// 		  			for(i = 0 ; i < destination.children.length ; i++) {
// 		  				$('<li><a href="' + formatDestinationNameAsHtmlFilename(destination.children[i].title) + '.html">' + destination.children[i].title + '</a></li>').appendTo('ul#subNavigation');
// console.log('added child: ' + destination.children[i].title + ' to current: ' + destination.title);
// 		  			}
				}

//console.log('c');
	  			// Add content
	  			if(destination.contents) {
	  				pageContents = makePageContents(destination.contents);
					$('#contentText').html(pageContents);
	  			}

				destinationFilePath = outputDir + formatDestinationNameAsHtmlFilename(destination.title) + '.html';
	  			// Append header and footer
	  			var destinationFileContents = '<html>' + $('html').html() + '</html>';

				fs.writeFile(destinationFilePath, destinationFileContents, function(err){
					if(err){
						console.log('could not write to file: ' + destinationFilePath);
						throw err;
					}
	
					pageCounter++;

					if(pageCounter === totalDestinations){
						finished(true);
					}
				});
			}
		});

	}

	function makePageNavigation() {
		
	}

	function makePageContents(allContents) {
	  	// Loop through the contents object and print each heading at each level
	  	var i,
	  		sectionTemplate = '<div class="contentSection">%s</div>',
	  		contentHtml = '',
	  		headingLevel = 2;

		for(i = 0 ; i < allContents.length ; i++){
			var nextContentObject = allContents[i];
			var nextSectionHtml = makeInnerSectionHtml(nextContentObject, headingLevel);
			contentHtml += util.format(sectionTemplate, nextSectionHtml);
		}
		
		return contentHtml;	
	}

	function makeInnerSectionHtml(sectionContentObject, headingLevel) {
		var name,
	  		headingTemplate = '<h%d>%s</h%d>',
	  		paragraphTemplate = '<p>%s</p>',
			nextSectionHtml = '', 
			innerSectionTemplate = '<div>%s</div>';
							
			for(name in sectionContentObject) {
				// Create first heading
				nextSectionHtml += util.format(headingTemplate, headingLevel, formatHeadingText(name), headingLevel);
				// If there's any text content add that
				if(typeof sectionContentObject[name] === 'string' || util.isArray(sectionContentObject[name])){
					if(typeof sectionContentObject[name] === 'string'){
						nextSectionHtml += util.format(paragraphTemplate, sectionContentObject[name]);
					} else {
						var j;
						for(j = 0 ; j < sectionContentObject[name].length ; j++) {
							nextSectionHtml += util.format(paragraphTemplate, sectionContentObject[name][j]);
						}
					}
				} else if(typeof sectionContentObject[name] === 'object' && !util.isArray(sectionContentObject[name])) {
					headingLevel++;
					nextSectionHtml += makeInnerSectionHtml(sectionContentObject[name], headingLevel);
					headingLevel = 2;
				}
			}
			return nextSectionHtml;
	}

	function formatDestinationNameAsHtmlFilename(destinationName) {
		return destinationName.toLowerCase().replace(/ /g, '-') + '.html';
	}

	function formatHeadingText(propertyName) {
		return propertyName.replace(/_/g, ' ');
	}

	function copyFile(oldFile, newFile) {
		// Read in template file
		fs.readFile(oldFile, function (err, data) {
  			if (err) {
  				throw err;	
  			} 
  			// Copy to new destination file
			fs.writeFile(newFile, data, function (err) {
				if (err) {
					throw err;
				}
			});
		});  
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