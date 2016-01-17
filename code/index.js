'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require('./config');
const intro = require('./intro');
const runner = require('./runner');
const localAppServer = require('./localAppServer');
const resultsPrinter = require('./resultsPrinter');

intro();

const prerun = config.localAppServer
	? localAppServer.start(config.localAppServer)
	: Promise.resolve();

prerun.then(runner)
	.then(results => resultsPrinter.printResults(results))
	.then(results => {
		process.exit(hasErrors(results) && config.failHard ? 1 : 0);
	}).catch(e => {
		console.error(e);
		resultsPrinter.resetStdout();
		process.exit(1)
	});

function hasErrors(results) {
	return results.some(result => result.errors.length);
}