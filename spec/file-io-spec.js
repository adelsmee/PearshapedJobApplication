// Test file-io.js
var fileIo = require('../src/file-io.js')
	path = require('path');

describe('FileIo', function () {  
	var copyDestination = 'spec/testdata/all.css';

	afterEach(function() {
		if(path.existsSync(copyDestination)){
		// Delete copied file
			fileIo.unlink(copyDestination, function(err) {
				if(err){
					console.error('could not delete file: ' + copyDestination);
				}
			});
		}
	});

	it('makes fileIo', function () {
		expect(fileIo).toBeDefined();
	});  

	it('should copy file', function(){
		var fileToCopy = 'data/css/all.css';
		var filesCopied = false;
		var copyComplete = function(done){
			filesCopied = done;
		};

		fileIo.copyFile(fileToCopy, copyDestination, copyComplete);
		
		waitsFor(function(){
			return filesCopied;
		}, 'Waited too long to copy', 10000);

		runs(function(){
			var copiedFileExists = path.existsSync(copyDestination);
			expect(copiedFileExists).toBeTruthy();
		});
	});


	//Test one method from the fs module just to make sure the code extends it properly
	it('should read file using fs', function(){
		var fileToRead = 'data/template.html';
		var dataRead;
		var readInResult = false;
		var result = function(err, data){
			if(err){
				throw err;
			}
			dataRead = data;
			readInResult = true;
		};

		fileIo.readFile(fileToRead, 'ascii', result);		

		waitsFor(function() {
			return readInResult;
		}, 'Took too long to read file: ' + fileToRead, 10000);

		runs(function(){
			expect(dataRead).toContain('<!DOCTYPE HTML PUBLIC "-/');
		});
	})
});     