/* commander component
 * To use add require('../cmds/<%= cmdName %>.js')(program) to your commander.js based node executable before program.parse
 */

module.exports = function(program) {

	program
		.command('<%= cmdName %>')
		.version('<%= cmdVersion %>')
		.description('<%= cmdDescription %>')
		.action(function(<%= args %>){
			<%= code %>
		});
	
};