const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

const fileName = path.join(__dirname, '../Logs', 'logs.log');

const logEvents = async (msg) => {
	const dateTime = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
	const content = `${dateTime} --- ${msg}\n`;
	try {
		fs.appendFile(fileName, content);
	} catch (err) {
		console.log(err);
	}
};

module.exports = logEvents;
