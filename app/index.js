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

CommanderGenerator.prototype.askForComponents = function askFor() {
  var cb = this.async();

  var prompts = [
          {
            name: 'components',
            type: 'checkbox',
            message: 'Additional components to install:',
            choices: [
              { name: 'Logger (adds a Winston logger)', value: 'logger' },
              { name: 'Commander loader (automatically loads commands from cmds/ directory)', value: 'loader' },
              { name: 'TabTab (adds command line autocompletion)', value: 'tabtab' },
              { name: 'Package (load reasonable defaults from your application\'s package.json)',value: 'package' },
              { name: 'Config (adds a config command)', value: 'config' },
              { name: 'Help (adds a `did you mean` messege when an unknown command is given)', value: 'help' },
            ]
          }
        ];

  this.prompt(prompts, function (props) {
    this.components = props.components;

    this.dependencies = '"commander": "~2.0.0"';
    if (props.components.length > 0)
        this.dependencies += ',\n    "autocmdr": "~0.0.4"';

    this.components = props.components
      .map(function(d) { return 'require(\'autocmdr/lib/'+d+'\')(program);' })
      .join('\n');

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
