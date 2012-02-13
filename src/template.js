// Template.js 1.0.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.

// The Template module provides access to:
// 		* HTML class and id selectors
// 		* HTML fragments for use with .format() 
// 		* Saved destination template page
// 		* Build method that takes an array of list links and return an unordered list
function newTemplate(){
	var config = require('./config.js'),
		fileIo = require('./file-io.js'),
		destinationPage = config.template.destinationPage,
		strictDoctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
		htmlOpen = '<html xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" lang="en">';
	
	return {
		page : strictDoctype + htmlOpen + '%s</html>',
		heading : '<h%d>%s</h%d>',
		paragraph : '<p>%s</p>',
		listLink : '<li class="%s"><a href="%s">%s</a></li>',
		section : '<div class="contentSection">%s</div>',
		innerSection : '<div>%s</div>',
		navigationDivId : 'div#navigation',
		titleClass : '.title',
		contentTextDivId : 'div#contentText',

		pageHtml : 	function(){
			var data = fileIo.readFileSync(destinationPage, 'ascii');
			return data;
		},

		buildNavigationHtml :function(links) {
			return '<ul>' + links.join('') + '</ul>';
		}
	};
}

module.exports = newTemplate;