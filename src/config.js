var config = {};

config.template = {};
config.performance = {};
config.site = {};
config.xml = {};

config.template.destinationPage = 'data/template.html';
config.site.files = [
	// All paths relative to application root 
	{
		originalPath : 'data/css',
		filename : 'all.css',
		destinationFolder : 'css'
	}
];
config.site.defaultOutputDir = 'default-output/';
config.xml.ignorePropertyNames = {
	asset_id: 'n',
	titleascii: 'n',
	destination: 'n',
	'@': 'n'
};
config.performance.numberOfConcurrentFileOperations = 222;

module.exports = config;