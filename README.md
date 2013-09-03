# generator-commander [![Build Status](https://secure.travis-ci.org/Hypercubed/generator-commander.png?branch=master)](https://travis-ci.org/Hypercubed/generator-commander) [![NPM version](https://badge.fury.io/js/generator-commander.png)](http://badge.fury.io/js/generator-commander)

A generator for [Yeoman](http://yeoman.io).

## Installation

Install Yeoman if you haven't done so already.

    $ npm install -g yo

To install generator-commander:

    $ npm install -g generator-commander

## Usage


At the command-line, cd into an empty directory, run this command and initiate the app generator:

    $ yo commander

This will generate files in the current working directory for a commander.js application.

To crate a commander.js command-component initiate the command generator:

    $ yo commander:command <name>

This will create a new file in cmds/ directory of the current working directory.  This file can be included in your application by including:

    require('../cmds/<name>.js')(program)

in your application.


## What is Yeoman?

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

Copyright (c) 2013 J. Harshbarger

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
