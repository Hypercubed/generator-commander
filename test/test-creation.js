/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('commander generators', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      done();
    }.bind(this));
  });

  it('commander:app creates expected files', function (done) {

      this.app = helpers.createGenerator('commander:app', [
        '../../app'
      ]);

    var expected = [
      '.jshintrc',
      '.editorconfig',
      'package.json',
      'bin/example',
      'test/example.js'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'example',
      'version': '0.0.0',
      'license': 'MIT',
      'author': 'J. H. Author',
      'authorEmail': 'jha@mail.com',
      'authorUrl': 'http://github.com/jhauthor',
      'repoUrl': 'http://github.com/jhauthor/example',
      'bugsUrl': 'http://github.com/jhauthor/example/issues'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('commander:command creates expected files', function (done) {

      this.app = helpers.createGenerator('commander:command', [
        '../../command'
      ], ['mycmd']);

    var expected = [
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

  it('commander:component creates expected files', function (done) {

      this.app = helpers.createGenerator('commander:component', [
        '../../component'
      ], ['mycomp']);

    var expected = [
      'lib/mycomp.js'
    ];

    helpers.mockPrompt(this.app, {
      'compName': 'mycomp'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

});

