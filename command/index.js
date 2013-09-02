'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var CommandGenerator = module.exports = function CommandGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the command subgenerator with the argument ' + this.name + '.');
};

util.inherits(CommandGenerator, yeoman.generators.NamedBase);

CommandGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
          {
            name: 'cmdName',
            pattern: /^[a-zA-Z0-9\s\-]+$/,
            message: 'Command name',
            default: this.name,
            required: true
          },
          { name: 'cmdVersion', default: '0.0.0', message: 'version' },
          { name: 'cmdDescription', default: 'A commander command', message: 'description' }
        ];

  this.prompt(prompts, function (props) {
    this.cmdName = props.cmdName;
    this.cmdSlug =  this._.slugify(props.cmdName);
    this.cmdVersion = props.cmdVersion;
    this.cmdDescription = props.cmdDescription;
    this.args = '\/\* Args here \*\/'
    this.code = '\/\/ Your code goes here';

    cb();
  }.bind(this));

};

CommandGenerator.prototype.files = function files() {
	this.mkdir('cmds');
	this.template('../../app/templates/cmds/command.js', 'cmds/'+this.cmdSlug+'.js');
};
