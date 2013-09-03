'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var CommanderGenerator = module.exports = function CommanderGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'], bower: false });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CommanderGenerator, yeoman.generators.Base);

CommanderGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
          {
            name: 'appName',
            pattern: /^[a-zA-Z0-9\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            default: path.basename(process.cwd()),
            required: true
          },
          { name: 'appVersion', default: '0.0.0', message: 'version' },  // TODO: validate
          { name: 'appDescription', default: 'A commander CLI app', message: 'description' },
          { name: 'author', default: '', message: 'author' },
          { name: 'license', default: 'MIT', message: 'license' }
        ];

  this.prompt(prompts, function (props) {
    this.appName = props.appName;
    this.appSlug =  this._.slugify(props.appName);
    this.appVersion = props.appVersion;
    this.appDescription = props.appDescription;
    this.appUsage = 'See `'+this.appSlug+' --help`';
    this.author = props.author;
    this.license = props.license;

    var today = new Date();
    this.year = today.getFullYear();

    cb();
  }.bind(this));

};

CommanderGenerator.prototype.app = function app() {
  this.mkdir('bin');
  this.mkdir('test');

  var slug = this.appSlug || 'test';  // npm test

  this.template('_package.json', 'package.json');
  this.template('Readme.md', 'Readme.md');
  this.template('bin/cmdrexec', 'bin/'+slug);
  this.template('test/test.js', 'test/'+slug+'.js');
};

CommanderGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
