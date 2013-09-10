# generator-commander [![Build Status](https://secure.travis-ci.org/Hypercubed/generator-commander.png?branch=master)](https://travis-ci.org/Hypercubed/generator-commander) [![NPM version](https://badge.fury.io/js/generator-commander.png)](http://badge.fury.io/js/generator-commander)

A CLI generator for [Yeoman](http://yeoman.io).

This generator will create a [Commander.js](https://github.com/visionmedia/commander.js) based command line application using [yo](https://github.com/yeoman/yo) with options to include [autocmdr](https://github.com/Hypercubed/autocmdr) components.

## Installation

Install Yeoman if you haven't done so already.

    $ npm install -g yo

To install generator-commander:

    $ npm install -g generator-commander

## Usage

At the command-line, `cd` into an empty directory, run this command and initiate the app generator:

    $ yo commander

This will generate files in the current working directory for a [Commander.js](https://github.com/visionmedia/commander.js) based application.

To crate a commander.js command-component initiate the command generator:

    $ yo commander:command <name>

This will create a new file in `cmds/` directory of the current working directory.  This file can be included in your application by adding

    require('../cmds/<name>.js')(program);

to your application in the `bin` directory; or optionally install the `autocmdr` components for auto-loading `cmds`.

## [autocmdr](https://github.com/Hypercubed/autocmdr) and generator-commander 

[autocmdr](https://github.com/Hypercubed/autocmdr) and generator-commander are brothers.  autcmdr is a command line tool for running commands (commands in a  commander.js command-component) and a set of libraries for enhancing command line applications.  generator-commander is a tool for scaffolding commander.js command-components and command line applications.

Calling `autocmdr` from a shell will load commands located in the current working directory's `cmds/` folder. New commands can be added to any directory by invoking `yo commander:command <name>`.  When running `yo commander` you are given the option of including autocmdr components in your application.  See the autocmdr [readme](https://github.com/Hypercubed/autocmdr/blob/master/Readme.md) for a complete workflow and explanation of the available components.

## What is Yeoman?

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

Copyright (c) 2013 J. Harshbarger
[![Gittip donate button](http://badgr.co/gittip/hypercubed.png)](https://www.gittip.com/hypercubed/ "Donate weekly to this project using Gittip")
[![Paypal donate button](http://badgr.co/paypal/donate.png?bg=%23feb13d)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X7KYR6T9U2NHC "One time donation to this project using Paypal")