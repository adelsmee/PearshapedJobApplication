// file-io.js 1.0.0
// (c) 2012 Adel Smee, Pearshaped Development Inc.
// A wrapper module for graceful-fs that adds a copyFile function
var fs = require('./graceful-fs.js');

fs.copyFile = copyFile;

function copyFile(oldFile, newFile, copyComplete) {
	fs.readFile(oldFile, function (err, data) {
			if (err) {
				console.error(err);
				throw new Error('Error reading file: ' + oldFile);	
			} 

		fs.writeFile(newFile, data, function (err) {
			if (err) {
				console.error(err);
				throw new Error('Error writing file: ' + newFile);
			}

			if(copyComplete){
				copyComplete(true);
			}
		});
	});  
}

module.exports = fs;
