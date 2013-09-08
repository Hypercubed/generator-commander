'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cp = require('child_process');

var GitHubApi = require('github');
var github = new GitHubApi({
  version: '3.0.0'
});

var CommanderGenerator = module.exports = function CommanderGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
  this.name = this.name || path.basename(process.cwd());


  this.hookFor('license', {
    as: 'app',
    args: [this.author, this.license],
    options: this.options
  });

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
            name: 'name',
            pattern: /^[a-zA-Z0-9\s\-]+$/,
            message: 'Name (must be only letters, spaces, or dashes)',
            default: this.name,
            required: true
          },
          { name: 'version', default: '0.0.0', message: 'Version' },
          { name: 'description', default: 'A commander CLI app', message: 'Description' },
          //{ name: 'homepage', message: 'Homepage' },
          //{ name: 'author', default: '', message: 'Author\'s Name' },
          { name: 'githubUser', message: 'GitHub username' },
          //{ name: 'authorEmail', message: 'Author\'s Email'},
          //{ name: 'authorUrl', message: 'Author\'s Homepage' },
          { name: 'license', default: 'MIT', message: 'license' }
        ];

  this.prompt(prompts, function (props) {
    util._extend(this, props);

    this.slugname =  this._.slugify(props.name);
    this.dependencies = '"commander": "~2.0.0"';

    this.licenseLink = (this.license == "MIT") ? "[MIT License](http://en.wikipedia.org/wiki/MIT_License)" : this.license;

    this.year = (new Date()).getFullYear();

    cb();
  }.bind(this));

};

var githubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) return cb(null);
    cb(JSON.parse(JSON.stringify(res)));
  });
};

CommanderGenerator.prototype.userInfo = function userInfo() {
  var done = this.async();

  githubUserInfo(this.githubUser, function (res) {
    if (res) {
        this.author = res.name;
        this.authorEmail = res.email;
        this.authorUrl = res.html_url;
        this.repoUrl = this.authorUrl + '/' + this.slugname;
        this.bugsUrl = this.repoUrl+ '/issues'
    } else {
    	console.log('Failed to retreive user information from GitHub.')
        this.author = '';
        this.authorEmail = '';
        this.authorUrl = '';
        this.repoUrl = '';
        this.bugsUrl = '';
    }

    done();
  }.bind(this));
};

CommanderGenerator.prototype.app = function app() {
  var cb = this.async();

  this.mkdir('bin');

  this.template('_package.json', 'package.json');
  this.template('bin/cmdrexec', 'bin/'+this.slugname);

  cb();
};

CommanderGenerator.prototype.readme = function readme() {
    var cb = this.async();

    var bin = path.join(process.cwd(), './bin/', this.slugname);

    cp.exec('node '+bin+' --help', function (error, stdout, stderr) {
        this.usage = (error === null) ? stdout : 'node ./bin/'+this.slugname+' --help';
        this.template('Readme.md', 'Readme.md');
        cb();
    }.bind(this));
}

CommanderGenerator.prototype.test = function projectfiles() {
  this.mkdir('test');

  this.template('test/test.js', 'test/'+this.slugname+'.js');
};

CommanderGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('travis.yml', '.travis.yml');
};
