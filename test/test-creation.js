/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('commander generator', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }



      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {

      this.app = helpers.createGenerator('commander:app', [
        '../../app'
      ]);

    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig',
      'package.json',
      'bin/example',
      'test/example.js'
    ];

    helpers.mockPrompt(this.app, {
      'appName': 'example'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates expected files', function (done) {

      this.app = helpers.createGenerator('commander:command', [
        '../../command'
      ], ['mycmd']);

    var expected = [
      // add files you expect to exist here.
      'cmds/mycmd.js'
    ];

    helpers.mockPrompt(this.app, {
      'cmdName': 'mycmd'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});

