/* <%= name %> commander component
 * To use add require('../cmds/<%= slugname %>.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

module.exports = function(program) {

	program
		.command('<%= slugname %>')
		.version('<%= version %>')
		.description('<%= description %>')
		.action(function (<%= args %>) {
			<%= code %>
		});

};
