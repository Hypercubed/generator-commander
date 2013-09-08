'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');

var ComponentGenerator = module.exports = function ComponentGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });

  this.on('end', function () {
    console.log();
    console.log('I\'m all done. Add `require(\'../lib/'+this.name+'.js\')(program);` to your app before program.parse.');
    console.log();
  });

  console.log('Generating a commander.js component');
};

util.inherits(ComponentGenerator, yeoman.generators.Base);

ComponentGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
          {
            name: 'name',
            pattern: /^[a-zA-Z0-9\s\-]+$/,
            message: 'Component name',
            default: this.name,
            required: true
          }
        ];

  this.prompt(prompts, function (props) {
  	this.name = props.name;
    this.slugname =  this._.slugify(props.name);
    this.code = '\/\/ Your code goes here';

    cb();
  }.bind(this));

};

ComponentGenerator.prototype.files = function files() {
	this.mkdir('lib');
	this.template('../../app/templates/lib/component.js', 'lib/'+this.slugname+'.js');
};
