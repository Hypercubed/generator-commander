/* global describe, it, before */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('commander generators', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  it('commander:app, with components creates expected files', function (done) {
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
      'components': [ 'logger', 'loader', 'completion', 'package', 'config', 'help' ],
      'name': 'example',
      'version': '0.0.0',
      'license': 'MIT',
      'author': 'J. H. Doe',
      'authorEmail': 'jhd@mail.com',
      'authorUrl': 'http://github.com/jhdoe',
      'repoUrl': 'http://github.com/jhdoe/example',
      'bugsUrl': 'http://github.com/jhdoe/example/issues'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  /* it('commander:app without components creates expected files', function (done) {

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
      'components': [ 'logger', 'loader', 'completion', 'config', 'help' ],
      'name': 'example',
      'version': '0.0.0',
      'license': 'MIT',
      'author': 'J. H. Doe',
      'authorEmail': 'jhd@mail.com',
      'authorUrl': 'http://github.com/jhdoe',
      'repoUrl': 'http://github.com/jhdoe/example',
      'bugsUrl': 'http://github.com/jhdoe/example/issues'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  }); */

  it('commander:command creates expected files', function (done) {
    this.app = helpers.createGenerator('commander:command', [
      '../../command'
    ], ['mycmd']);

    var expected = [
      'cmds/mycmd.js'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'mycmd',
      'version': '0.0.0'
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
      'name': 'mycomp'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
