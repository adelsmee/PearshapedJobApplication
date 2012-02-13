// Test Template
var newTemplate = require('../src/template.js');

describe('Template', function () {  
	var template;

	beforeEach(function() {
		template = newTemplate();
	});

	afterEach(function() {
	});

	it('makes template', function () {
		expect(template).toBeDefined();
	});  

	it('get page template', function(){
		var pageTemplate = template.page;
		expect(pageTemplate).toContain('<html xml:lang="en" xmlns="http://www.w3.org');			
	});

	it('get heading', function(){
		var heading = template.heading;
		expect(heading).toContain('<h%d>%s</h%d>');			
	});

	it('get paragraph', function(){
		var paragraph = template.paragraph;
		expect(paragraph).toContain('<p>%s</p>');			
	});

	it('get list link', function(){
		var listLink = template.listLink;
		expect(listLink).toContain('<li class="%s"><a href="%s">%s</a></li>');			
	});

	it('get section', function(){
		var section = template.section;
		expect(section).toContain('<div class="contentSection">%s</div>');			
	});

	it('get inner section', function(){
		var innerSection = template.innerSection;
		expect(innerSection).toContain('<div>%s</div>');			
	});

	it('get navigation div id', function(){
		var navDivId = template.navigationDivId;
		expect(navDivId).toContain('div#navigation');			
	});

	it('get title class', function(){
		var titleClass = template.titleClass;
		expect(titleClass).toContain('.title');			
	});

	it('get content text div id', function(){
		var contentTextDivId = template.contentTextDivId;
		expect(contentTextDivId).toContain('div#contentText');			
	});

	it('get page html', function(){
		var pageHtml = template.pageHtml();
		expect(pageHtml).toContain('<div id="wrapper">');			
	});

	it('build navigation html', function(){
		var linkList = [
			'<li><a href="a.html"></a></li>',
			'<li><a href="b.html"></a></li>',
			'<li><a href="c.html"></a></li>',
			'<li><a href="d.html"></a></li>'
		];
		var navigationHtml = template.buildNavigationHtml(linkList);
		expect(navigationHtml).toContain('<ul><li');			
	});
});     