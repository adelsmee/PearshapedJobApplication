
function newPageMaker(outputDir) {
	var fs = require('fs'),
		path = require('path'),
		util = require('util'),
//		$ = require('jquery'),
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

	function makeDestinationPage(destination) {
		var destinationFilePath = outputDir + formatDestinationName(destination.title) + '.html';
		// Store the template in the jquery object for manipulation
		fs.readFile(templateFile, function (err, data) {
  			if (err) {
  				throw err;	
  			} 
			var jsdom = require('jsdom');

			jsdom.env({
				html: data,
				scripts: [
					'http://code.jquery.com/jquery-1.5.min.js',
					'file://node-modules/jquery/jquery.tmpl.min.js'
				]
			}, function (err, window) {
				var $ = window.jQuery;
				// [Would have loved to have used a templating tool like jquery.tmpl but
				//  it was not meant to be...]
//console.log(($('html').html().splice(0, 100)));
				// Now document is loaded can traverse the DOM using JQuery, adding the necessaries
				// Add title
				$('.title').text(destination.title);
	  			// Add parent navigation
	  			if(destination.parentDestination.title){
		  			var parentHref = (destination.parentDestination.title ? destination.parentDestination.title : 'index') + '.html';
		  			$('<li><a href="' + formatDestinationName(parentHref) + '">' + destination.parentDestination.title + '</a></li>').appendTo('ul#navigation');
		  			$('<li class="selected"><a href="' + formatDestinationName(destination.title) + '.html">' + destination.title + '</a></li>').appendTo('ul#navigation');
			  	}
		  			// Add child navigation
	  			if(destination.children) {
		  			var i;
		  			for(i = 0 ; i < destination.children.length ; i++) {
		  				$('<li><a href="' + formatDestinationName(destination.children[i].title) + '.html">' + destination.children[i].title + '</a></li>').appendTo('ul#subNavigation');
		  			}
				}
	  			// Add content
	  			if(destination.contents) {
	  				var pageContents = makePageContents(destination.contents);
					$('#contentText').html(pageContents);
	  			}

	  			// Append header and footer
	  			$('<html>').insertBefore('head');
	  			$('</html>').insertAfter('body');
	  			// Copy to new destination file
				fs.writeFile(destinationFilePath, $('html').html(), function (err) {
					if (err) {
						throw err;
					}
//console.log('Saved new file: ' + destinationFilePath);
				});
			});
		});  
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
							
//console.log('outer object to parse: ' + JSON.stringify(Object.keys(sectionContentObject)));
			for(name in sectionContentObject) {
				// Create first heading
				nextSectionHtml += util.format(headingTemplate, headingLevel, formatHeadingText(name), headingLevel);
//console.log('first heading: ' + util.format(headingTemplate, headingLevel, formatHeadingText(name), headingLevel));
				// If there's any text content add that
// console.log('inner object to parse: ' + JSON.stringify(Object.keys(sectionContentObject[name])));
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

	function formatDestinationName(destinationName) {
		return destinationName.toLowerCase().replace(/ /g, '-');
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
				console.log('Saved new file: ' + newFile);
			});
		});  
	}

	function makePageNavigation() {
		
	}

	return {
		// Public methods
		makeDestinationPage: function(destination){
			makeDestinationPage(destination);
		}

	};
}

module.exports = newPageMaker;