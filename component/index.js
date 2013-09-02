'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ComponentGenerator = module.exports = function ComponentGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the component subgenerator with the argument ' + this.name + '.');
};

util.inherits(ComponentGenerator, yeoman.generators.NamedBase);

ComponentGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
          {
            name: 'compName',
            pattern: /^[a-zA-Z0-9\s\-]+$/,
            message: 'Component name',
            default: this.name,
            required: true
          }
        ];

  this.prompt(prompts, function (props) {
  	this.compName = props.compName;
    this.compSlug =  this._.slugify(props.compName);
    this.code = '\/\/ Your code goes here';

    cb();
  }.bind(this));

};

ComponentGenerator.prototype.files = function files() {
	this.mkdir('lib');
	this.template('../../app/templates/lib/component.js', 'lib/'+this.compSlug+'.js');
};
