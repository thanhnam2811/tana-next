/* eslint-disable import/newline-after-import */
/* eslint-disable camelcase */
const axios = require('axios');
const webhook_url = process.env.WEBHOOK_URL;

exports.sendNotificationToBotty = async (error, log) => {
	try {
		let slackbody;
		if (log) {
			slackbody = {
				mkdwn: true,
				attachments: [
					{
						pretext: 'Booty Notification',
						title: 'Activity Log',
						color: 'good',
						text: log,
					},
				],
			};
		} else if (error) {
			slackbody = {
				mkdwn: true,
				attachments: [
					{
						pretext: 'Booty Notification',
						title: 'Error Notification',
						color: '#f50057',
						text: error,
					},
				],
			};
		}
		await axios.post(webhook_url, slackbody);
	} catch (err) {
		console.log(err);
	}
};
