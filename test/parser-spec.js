// Test the Parser
describe("Parser", function(){
	beforeEach(function() {
  		this.parser = newParser('tax.xml', 'dest.xml');
	});

	it("cleans property name of hyphens", function() {
		expect(this.parser.removeDirtyCharacters("nasty-hypen")).toEqual("nastyhyphen");
	});
});
