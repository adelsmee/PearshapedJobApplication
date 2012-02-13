// XmlRepository.js 1.0.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.
//
// The repository module used to access XML data.
function newXmlRepository(taxonomyXml, destinationsXml) {
	var fs = require('./file-io.js');

	function getXml(xmlFilename, returnXml){
		fs.readFile(xmlFilename, function(err, xmlData) {
			if(err){
				console.error(err);
				throw new Error('Unable to read file: ' + xmlFilename); 
			}
			
			returnXml(xmlData);
		});
	}

	return {
		getTaxonomyXml : function(returnXml){
			return getXml(taxonomyXml, returnXml);
		},
		getDestinationsXml : function(returnXml) {
			return getXml(destinationsXml, returnXml);
		}
	}
}

module.exports = newXmlRepository;