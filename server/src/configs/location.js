const { SuperfaceClient } = require('@superfaceai/one-sdk');
require('dotenv').config();

// You can manage tokens here: https://superface.ai/insights
const sdk = new SuperfaceClient({
	sdkAuthToken:
		'sfs_3ed7de44a8c223a88d7a3843541bf06916dbe7e2644878fb8d57b32f4dc5648c3cd8153cd694bd0ff60ac917355f7e30089a25415e89da7d783225b8054c6248_c545e10b',
});

module.exports = async function getLocationByIPAddress(ipAddress) {
	// Load the profile
	const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');

	// Use the profile
	const result = await profile.getUseCase('IpGeolocation').perform(
		{
			ipAddress,
		},
		{
			provider: 'ipdata',
			security: {
				apikey: {
					apikey: process.env.API_KEY_LOCATION,
				},
			},
		}
	);

	// Handle the result
	try {
		const data = result.unwrap();
		return data;
	} catch (error) {
		console.error(error);
	}
};
