'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cp = require('child_process');

var GitHubApi = require('github');
var github = new GitHubApi({
  version: '3.0.0'
});

var CommanderGenerator = module.exports = function CommanderGenerator (args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
  this.name = this.name || path.basename(process.cwd());

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'], bower: false });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CommanderGenerator, yeoman.generators.Base);

CommanderGenerator.prototype.askFor = function askFor () {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      name: 'name',
      pattern: /^[a-zA-Z0-9\s\-]+$/,
      message: 'Name (must be only letters, spaces, or dashes)',
      default: this.name,
      required: true
    },
    { name: 'version', default: '0.0.0', message: 'Version' },
    { name: 'description', default: 'A commander CLI app', message: 'Description' },
    // { name: 'homepage', message: 'Homepage' },
    // { name: 'author', default: '', message: 'Author\'s Name' },
    // { name: 'githubUser', message: 'GitHub username' },
    // { name: 'authorEmail', message: 'Author\'s Email'},
    // { name: 'authorUrl', message: 'Author\'s Homepage' },
    { name: 'license', default: 'MIT', message: 'license' }
  ];

  this.prompt(prompts, function (props) {
    util._extend(this, props);

    this.slugname = this._.slugify(props.name);
    this.dependencies = '"commander": "~2.0.0"';

    this.licenseLink = (this.license === 'MIT') ? '[MIT License](http://en.wikipedia.org/wiki/MIT_License)' : this.license;

    this.year = (new Date()).getFullYear();

    cb();
  }.bind(this));
};

var githubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) { return cb(null); }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

CommanderGenerator.prototype.githubInfo = function githubInfo () {
  var cb = this.async();

  var prompts = [
    { name: 'githubUser', message: 'GitHub username' }
  ];

  this.prompt(prompts, function (props) {
    this.githubUser = props.githubUser;

    console.log('');
    console.log('    Retrieving user information from GitHub.  Please wait.');
    githubUserInfo(this.githubUser, function (res) {
      if (res) {
        console.log('    Retrieved user information from GitHub.');
        this.author = res.name;
        this.authorEmail = res.email;
        this.authorUrl = res.html_url;
        this.repoUrl = this.authorUrl + '/' + this.slugname;
        this.bugsUrl = this.repoUrl + '/issues';
      } else {
        console.log('    Failed to retrieve user information from GitHub.');
        this.author = '';
        this.authorEmail = '';
        this.authorUrl = 'https://github.com/' + this.githubUser + '/';
      }

      this.repoUrl = this.authorUrl + '/' + this.slugname;
      this.bugsUrl = this.repoUrl + '/issues';

      cb();
    }.bind(this));
  }.bind(this));
};

CommanderGenerator.prototype.userInfo = function userInfo () {
  var cb = this.async();

  var prompts = [
    { name: 'author', message: 'Author\'s Name', default: this.author },
    { name: 'authorEmail', message: 'Author\'s Email', default: this.authorEmail },
    { name: 'authorUrl', message: 'Author\'s Homepage', default: this.authorUrl },
    { name: 'repoUrl', message: 'Repository URL', default: this.repoUrl },
    { name: 'bugsUrl', message: 'Support URL', default: this.bugsUrl }
  ];

  console.log('');
  console.log('    Please confirm the following.');
  this.prompt(prompts, function (props) {
    util._extend(this, props);

    console.log('');

    cb();
  }.bind(this));
};

CommanderGenerator.prototype.askForComponents = function askFor () {
  var cb = this.async();

  var prompts = [
    {
      name: 'components',
      type: 'checkbox',
      message: 'Additional components to install:',
      choices: [
        { name: 'Logger (adds a Winston logger, required for config, package, loader, and help components)', value: 'logger' },
        { name: 'Commander loader (automatically loads commands from cmds/ directory)', value: 'loader' },
        { name: 'Autocompletion (adds command line autocompletion)', value: 'completion' },
        { name: 'Package (load reasonable defaults from your application\'s package.json)', value: 'package' },
        { name: 'Config (adds a config command)', value: 'config' },
        { name: 'Help (adds a `did you mean` messege when an unknown command is given)', value: 'help' }
      ]
    }
  ];

  this.prompt(prompts, function (props) {
    this.components = props.components;

    this.dependencies = '"commander": "~2.0.0"';
    if (props.components.length > 0) {
      this.dependencies += ',\n    "autocmdr": "~0.0.7"';
    }

    var loggerNeeded = props.components.indexOf('config') > -1 ||
      props.components.indexOf('help') > -1 ||
      props.components.indexOf('loader') > -1 ||
      props.components.indexOf('package') > -1;

    if (loggerNeeded && props.components.indexOf('logger') < 0) {
      props.components.unshift('logger');  // logger must be first
    }

    this.components = props.components
      .map(function (d) { return 'require(\'autocmdr/lib/' + d + '\')(program);'; })
      .join('\n');

    this.logger = props.components.indexOf('logger') > -1;
    this.package = props.components.indexOf('package') > -1;
    this.help = props.components.indexOf('help') > -1;

    cb();
  }.bind(this));
};

CommanderGenerator.prototype.app = function app () {
  var cb = this.async();  // Need to ensure this runs before readme

  this.mkdir('bin');

  this.template('_package.json', 'package.json');
  this.template('bin/cmdrexec', 'bin/' + this.slugname);

  cb();
};

CommanderGenerator.prototype.readme = function readme () {
  var cb = this.async();

  var bin = path.join(process.cwd(), './bin/', this.slugname);

  cp.exec('node ' + bin + ' --help', function (error, stdout) {
    this.usage = (error === null) ? stdout : 'node ./bin/' + this.slugname + ' --help';
    this.template('Readme.md', 'Readme.md');
    cb();
  }.bind(this));
};

CommanderGenerator.prototype.test = function projectfiles () {
  this.mkdir('test');

  this.template('test/test.js', 'test/' + this.slugname + '.js');
};

CommanderGenerator.prototype.projectfiles = function projectfiles () {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('travis.yml', '.travis.yml');
};
