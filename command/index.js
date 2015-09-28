'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');

var CommandGenerator = module.exports = function CommandGenerator() {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });

  this.on('end', function () {
    console.log();
    console.log('I\'m all done. Add `require(\'../cmds/'+this.name+'.js\')(program);` to your app before program.parse.');
    console.log();
  });

  console.log('Generating a commander.js command component');
};

util.inherits(CommandGenerator, yeoman.generators.Base);

CommandGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      name: 'name',
      pattern: /^[a-zA-Z0-9\s\-]+$/,
      message: 'Command name',
      default: this.name,
      required: true
    },
    { name: 'version', default: '0.0.0', message: 'version' },
    { name: 'description', default: 'A commander command', message: 'description' }
  ];

  this.prompt(prompts, function (props) {
    util._extend(this, props);

    this.slugname =  this._.slugify(props.name);
    this.args = '\/\* Args here \*\/';
    this.code = '\/\/ Your code goes here';

    cb();
  }.bind(this));

};

CommandGenerator.prototype.files = function files() {
	this.mkdir('cmds');
	this.template('../../app/templates/cmds/command.js', 'cmds/'+this.slugname+'.js');
};
