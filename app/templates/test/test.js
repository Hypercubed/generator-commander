'use strict';

var assert = require("assert");
var exec = require('child_process').exec;
var path = require('path');

describe('<%= slugname %> bin', function(){
	var cmd = 'node '+path.join(__dirname, '../bin/<%= slugname %>')+' ';
	console.log(cmd);

	it('--help should run without errors', function(done) {
		exec(cmd+'--help', function (error, stdout, stderr) {
			assert(!error);
			assert(stdout.match(/Usage: <%= slugname %>/i));
			done();
		});
	});

	it('--version should run without errors', function(done) {
		exec(cmd+'--version', function (error, stdout, stderr) {
			assert(!error);
			assert(stdout.match('<%= version %>'));
			done();
		});
	});

	it('should return error on missing command', function(done) {
        this.timeout(4000);

		exec(cmd, function (error, stdout, stderr) {
			assert(error);
			assert.equal(error.code,1);
			assert(stdout.match(/No command specified/i));
			done();
		});

	});

	it('should return error on unknown command', function(done) {
        this.timeout(4000);

		exec(cmd+'junkcmd', function (error, stdout, stderr) {
			assert(error);
			assert.equal(error.code,1);
			assert(stdout.match(/is not a known command/i));
			done();
		});
	});

});
